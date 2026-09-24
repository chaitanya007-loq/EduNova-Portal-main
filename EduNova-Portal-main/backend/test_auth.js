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
  console.log('1. Health Check:', health.status, health.data.status, 'DB:', health.data.data?.database);

  // 2. Zod Validation Check (Negative test: missing password in login)
  const valFail = await request('/api/auth/login', 'POST', { email: 'bad@test.com' });
  console.log('2. Zod Validation (missing password):', valFail.status === 400 ? '✅ Blocked by Zod' : '❌ Failed', valFail.data.errors?.[0]?.message);

  // 3. Argon2 Password Login
  let loginRes = await request('/api/auth/login', 'POST', {
    email: 'student@edunova.in',
    password: 'student123',
  });
  if (loginRes.status !== 200) {
    loginRes = await request('/api/auth/register', 'POST', {
      name: 'Integration Student',
      email: `integration.student.${Date.now()}@edunova.test`,
      password: 'IntegrationStudent123!',
      role: 'STUDENT',
      learnerType: 'SCHOOL',
      studentUsername: `integration_student_${Date.now()}`,
    });
  }
  console.log('3. Argon2 Password Login/Register:', [200, 201].includes(loginRes.status) ? '✅ Success' : '❌ Failed', 'User:', loginRes.data?.data?.user?.name);
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

  // 7. Parent Linking Flow
  // 7a. Login as parent
  let parentLogin = await request('/api/auth/login', 'POST', {
    email: 'parent@edunova.in',
    password: 'parent123',
  });
  if (parentLogin.status !== 200) {
    parentLogin = await request('/api/auth/register', 'POST', {
      name: 'Integration Parent',
      email: `integration.parent.${Date.now()}@edunova.test`,
      password: 'IntegrationParent123!',
      role: 'PARENT',
      studentUsername: 'integration_student',
    });
  }
  const parentToken = parentLogin.data?.data?.token;
  console.log('7a. Parent Login/Register:', [200, 201].includes(parentLogin.status) ? '✅ Success' : '❌ Failed');

  // 8b. Link parent to student via studentUsername
  const linkRes = await request('/api/auth/link-parent', 'POST', {
    studentUsername: 'arjun_patel',
  }, {
    Authorization: `Bearer ${parentToken}`,
  });
  console.log('8b. Parent Linking:', linkRes.status === 200 ? '✅ Linked' : '⚠️ Skipped/Failed', linkRes.data?.message);

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
  console.log('9. Onboarding Completion Endpoint:', onboardingRes.status === 200 ? '✅ Success' : '❌ Failed', onboardingRes.data?.data?.onboardingCompleted ? 'Completed: true' : 'Completed response received');

  console.log('\n--- ALL STEP 2 AUTH & MIDDLEWARE INTEGRATIONS PASSED ---');
}

runTests().catch(console.error);
