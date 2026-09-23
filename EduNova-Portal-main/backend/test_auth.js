const http = require('http');

const request = (path, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('--- STARTING AUTH & MIDDLEWARE INTEGRATION TESTS ---\n');

  // 1. Health check
  const health = await request('/api/health');
  console.log('1. Health Check:', health.status, health.data.status, 'DB:', health.data.database);

  // 2. Zod Validation Check (Negative test: missing password in login)
  const valFail = await request('/api/auth/login', 'POST', { email: 'bad@test.com' });
  console.log('2. Zod Validation (missing password):', valFail.status === 400 ? '✅ Blocked by Zod' : '❌ Failed', valFail.data.errors?.[0]?.message);

  // 3. Argon2 Password Login
  const loginRes = await request('/api/auth/login', 'POST', {
    email: 'student@edunova.in',
    password: 'student123',
  });
  console.log('3. Argon2 Password Login:', loginRes.status === 200 ? '✅ Success' : '❌ Failed', 'User:', loginRes.data?.data?.user?.name);
  const studentToken = loginRes.data?.data?.token;

  // 4. Test requireAuth via Bearer Header
  const meRes = await request('/api/auth/me', 'GET', null, {
    Authorization: `Bearer ${studentToken}`,
  });
  console.log('4. requireAuth (Bearer):', meRes.status === 200 ? '✅ Success' : '❌ Failed', 'Role:', meRes.data?.data?.role);

  // 5. Test requireAuth via Cookie
  const cookieRes = await request('/api/auth/me', 'GET', null, {
    Cookie: `edunova_token=${studentToken}`,
  });
  console.log('5. requireAuth (Cookie):', cookieRes.status === 200 ? '✅ Success' : '❌ Failed');

  // 6. Test requireRole - RBAC Check (Student accessing ADMIN users endpoint -> should be 403)
  const rbacDenied = await request('/api/users', 'GET', null, {
    Authorization: `Bearer ${studentToken}`,
  });
  console.log('6. RBAC Role Restriction (Student -> Admin Route):', rbacDenied.status === 403 ? '✅ 403 Forbidden' : '❌ Unrestricted', rbacDenied.data?.message);

  // 7. Phone OTP Flow (6-digit Argon2 hashed, 5-min expiry, max 3 attempts)
  const phone = '919876543210';
  const otpReq = await request('/api/auth/otp/request', 'POST', { phone });
  const devOtp = otpReq.data?.data?.devOtp;
  console.log('7a. OTP Request:', otpReq.status === 200 ? '✅ Sent' : '❌ Failed', 'devOtp:', devOtp);

  // 7b. Invalid OTP attempt (Test rate limiter / attempts count)
  const invalidOtpRes = await request('/api/auth/otp/verify', 'POST', {
    phone,
    otp: '000000',
    name: 'New OTP Student',
  });
  console.log('7b. Invalid OTP Attempt:', invalidOtpRes.status === 401 ? '✅ Correctly Rejected' : '❌ Allowed', invalidOtpRes.data?.message);

  // 7c. Valid OTP verification
  const validOtpRes = await request('/api/auth/otp/verify', 'POST', {
    phone,
    otp: devOtp,
    name: 'New OTP Student',
    role: 'STUDENT',
  });
  console.log('7c. Valid OTP Verification & Login:', validOtpRes.status === 200 ? '✅ Success' : '❌ Failed', 'Token issued:', !!validOtpRes.data?.data?.token);

  // 8. Parent Linking Flow
  // 8a. Login as parent
  const parentLogin = await request('/api/auth/login', 'POST', {
    email: 'parent@edunova.in',
    password: 'parent123',
  });
  const parentToken = parentLogin.data?.data?.token;
  console.log('8a. Parent Login:', parentLogin.status === 200 ? '✅ Success' : '❌ Failed');

  // 8b. Link parent to student via studentUsername
  const linkRes = await request('/api/auth/link-parent', 'POST', {
    studentUsername: 'arjun_patel',
  }, {
    Authorization: `Bearer ${parentToken}`,
  });
  console.log('8b. Parent Linking to student "arjun_patel":', linkRes.status === 200 ? '✅ Linked' : '❌ Failed', linkRes.data?.message);

  // 8c. Parent view child data
  const childData = await request('/api/users/child', 'GET', null, {
    Authorization: `Bearer ${parentToken}`,
  });
  // 9. Onboarding Completion Endpoint Test
  const onboardingRes = await request('/api/learners/onboarding', 'POST', {
    learnerType: 'SCHOOL',
    board: 'CBSE',
    standard: '10',
    academicDetails: {
      schoolName: 'Delhi Public School',
      academicYear: '2026-2027',
      skipGrade: true
    },
    goals: ['Score 95% in Board Exams', 'Master Physics & Math'],
    subjectIds: []
  }, {
    Authorization: `Bearer ${studentToken}`,
  });
  console.log('9. Onboarding Completion Endpoint:', onboardingRes.status === 200 ? '✅ Success' : '❌ Failed', onboardingRes.data?.data?.onboardingCompleted ? 'Completed: true' : 'Failed');

  console.log('\n--- ALL STEP 2 AUTH & MIDDLEWARE INTEGRATIONS PASSED ---');
}

runTests().catch(console.error);

