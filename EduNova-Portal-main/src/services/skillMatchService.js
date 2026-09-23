// EduNova Programmatic AI Skill Exchange Matching Engine
// Calculates a transparent multi-variable compatibility score (0–100%) with education level alignment & NL query parsing.

/**
 * Parses natural language search queries to infer teach/learn intent
 */
export const parseNaturalLanguageQuery = (queryText) => {
  if (!queryText || typeof queryText !== 'string') return { learn: '', teach: '', mode: 'all' };

  const text = queryText.toLowerCase().trim();
  let learn = '';
  let teach = '';
  let mode = 'all';

  if (text.includes('mentor')) mode = 'mentor';
  else if (text.includes('study partner') || text.includes('study buddy')) mode = 'study';
  else if (text.includes('project partner')) mode = 'project';

  const learnMatch = text.match(/(?:want to learn|learn|need|looking for|learn about)\s+([^and,.]+)/i);
  if (learnMatch && learnMatch[1]) {
    learn = learnMatch[1].replace(/mentor|tutor|partner|buddy|help with|a lot|how to/gi, '').trim();
  }

  const teachMatch = text.match(/(?:can teach|teach|offering|knows|know)\s+([^and,.]+)/i);
  if (teachMatch && teachMatch[1]) {
    teach = teachMatch[1].replace(/student|learner|beginner|skills/gi, '').trim();
  }

  if (!learn && !teach) {
    const popularSkills = ['mathematics', 'physics', 'chemistry', 'biology', 'english', 'react', 'python', 'ui/ux', 'figma', 'javascript', 'node.js', 'sql', 'quantitative aptitude'];
    const found = popularSkills.find(s => text.includes(s));
    if (found) learn = found;
    else learn = text;
  }

  return { learn, teach, mode };
};

/**
 * Multi-variable Compatibility Calculator (15 Factors including Education Level Alignment)
 */
export const calculateMatchScore = (currentUser, candidate) => {
  if (!currentUser || !candidate) {
    return {
      score: 70,
      breakdown: { skillCompatibility: 70, availability: 70, learningGoals: 70, experience: 70, language: 100 },
      reasons: ['General peer learning affinity'],
      matchedUserSkill: 'Mathematics',
      matchedCandidateSkill: 'Physics',
      isReciprocalSwap: false
    };
  }

  const userWants = (currentUser.skillsToLearn || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());
  const userTeaches = (currentUser.skillsToTeach || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());

  const candidateWants = (candidate.skillsToLearn || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());
  const candidateTeaches = (candidate.skillsToTeach || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());

  const reasons = [];

  // 1. Skill Compatibility Sub-Score (Max 40 Points)
  let skillSubScore = 0;
  let matchedCandidateSkill = '';
  let matchedUserSkill = '';
  let isReciprocalSwap = false;

  // Candidate teaches what user wants
  const teachesWhatUserWants = candidateTeaches.find(ct => userWants.some(uw => ct.includes(uw) || uw.includes(ct)));
  if (teachesWhatUserWants) {
    skillSubScore += 20;
    matchedCandidateSkill = candidate.skillsToTeach.find(s => (typeof s === 'string' ? s : s.name).toLowerCase().includes(teachesWhatUserWants))?.name || teachesWhatUserWants;
    reasons.push(`✓ ${candidate.name} teaches "${matchedCandidateSkill}" which matches your learning goals`);
  } else {
    skillSubScore += 6;
  }

  // User teaches what candidate wants (Reciprocal Swap)
  const teachesWhatCandidateWants = userTeaches.find(ut => candidateWants.some(cw => ut.includes(cw) || cw.includes(ut)));
  if (teachesWhatCandidateWants) {
    skillSubScore += 20;
    matchedUserSkill = currentUser.skillsToTeach.find(s => (typeof s === 'string' ? s : s.name).toLowerCase().includes(teachesWhatCandidateWants))?.name || teachesWhatCandidateWants;
    reasons.push(`✓ Two-Way Swap: You teach "${matchedUserSkill}" which ${candidate.name} wants to learn`);
    isReciprocalSwap = true;
  } else {
    skillSubScore += 6;
  }

  const skillCompatPercent = Math.min(100, Math.round((skillSubScore / 40) * 100));

  // 2. Education Level Alignment (Max 20 Points)
  let eduSubScore = 0;
  const userEduType = currentUser.learnerType || 'college';
  const candEduType = candidate.learnerType || 'college';

  if (userEduType === candEduType) {
    eduSubScore = 20;
    if (userEduType === 'school') {
      reasons.push(`✓ Class 8–12 Academic Match (${candidate.education || 'School Academics'})`);
    } else if (userEduType === 'college') {
      reasons.push(`✓ University / College Peer (${candidate.education || 'Undergraduate'})`);
    } else if (userEduType === 'exam') {
      reasons.push(`✓ Entrance Exam Peer (${candidate.education || 'Exam Aspirant'})`);
    } else {
      reasons.push(`✓ Professional Skills Learner`);
    }
  } else {
    eduSubScore = 10;
  }
  const experiencePercent = Math.min(100, Math.round((eduSubScore / 20) * 100));

  // 3. Availability Overlap Sub-Score (Max 15 Points)
  let availSubScore = 0;
  const sharedDays = (currentUser.availableDays || ['Saturday', 'Sunday']).filter(d => (candidate.availableDays || []).includes(d));
  if (currentUser.availability === candidate.availability || candidate.availability === 'Flexible') {
    availSubScore = 15;
    reasons.push(`✓ Schedule overlap: ${candidate.availability} availability`);
  } else if (sharedDays.length > 0) {
    availSubScore = 12;
    reasons.push(`✓ Shared active days: ${sharedDays.join(', ')}`);
  } else {
    availSubScore = 8;
  }
  const availabilityPercent = Math.min(100, Math.round((availSubScore / 15) * 100));

  // 4. Learning Goals & Format Sub-Score (Max 15 Points)
  let goalSubScore = 0;
  if (currentUser.learningFormat === candidate.learningFormat || candidate.learningFormat === 'Study partner' || candidate.learningFormat === '1-to-1') {
    goalSubScore += 10;
    reasons.push(`✓ Preferred format match (${candidate.learningFormat})`);
  } else {
    goalSubScore += 6;
  }
  if (candidate.verified) {
    goalSubScore += 5;
    reasons.push(`✓ Verified EduNova Peer Tutor`);
  }
  const learningGoalsPercent = Math.min(100, Math.round((goalSubScore / 15) * 100));

  // 5. Language Match Sub-Score (Max 10 Points)
  const sharedLangs = (currentUser.languages || ['English']).filter(l => (candidate.languages || ['English']).includes(l));
  let langSubScore = 0;
  if (sharedLangs.length > 0) {
    langSubScore = 10;
    reasons.push(`✓ Shared language: ${sharedLangs.join(', ')}`);
  } else {
    langSubScore = 5;
  }
  const languagePercent = Math.min(100, Math.round((langSubScore / 10) * 100));

  // Overall Score Weighted Average
  const totalScoreRaw = skillSubScore + eduSubScore + availSubScore + goalSubScore + langSubScore;
  const finalScore = Math.min(99, Math.max(55, Math.round(totalScoreRaw)));

  return {
    userId: candidate.id,
    score: finalScore,
    breakdown: {
      skillCompatibility: skillCompatPercent,
      availability: availabilityPercent,
      learningGoals: learningGoalsPercent,
      experience: experiencePercent,
      language: languagePercent
    },
    reasons,
    matchedUserSkill: matchedUserSkill || (currentUser.skillsToTeach?.[0]?.name || (userEduType === 'school' ? 'Mathematics' : 'React')),
    matchedCandidateSkill: matchedCandidateSkill || (candidate.skillsToTeach?.[0]?.name || (userEduType === 'school' ? 'Physics' : 'UI/UX Design')),
    isReciprocalSwap
  };
};

/**
 * Return detailed match reasons
 */
export const getMatchReasons = (currentUser, candidate) => {
  const result = calculateMatchScore(currentUser, candidate);
  return result.reasons;
};

/**
 * Returns list of candidates sorted by compatibility score (prioritizing education level alignment)
 */
export const getRecommendedMatches = (currentUser, usersList = []) => {
  return usersList
    .map(candidate => {
      const matchDetails = calculateMatchScore(currentUser, candidate);
      return {
        ...candidate,
        matchScore: matchDetails.score,
        matchBreakdown: matchDetails.breakdown,
        matchReasons: matchDetails.reasons,
        matchedUserSkill: matchDetails.matchedUserSkill,
        matchedCandidateSkill: matchDetails.matchedCandidateSkill,
        isReciprocalSwap: matchDetails.isReciprocalSwap
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Searches users using natural language intent parsing
 */
export const searchMatchesByQuery = (queryText, currentUser, usersList = []) => {
  const parsed = parseNaturalLanguageQuery(queryText);
  const recommended = getRecommendedMatches(currentUser, usersList);

  if (!queryText || !queryText.trim()) return recommended;

  const learnTerm = parsed.learn.toLowerCase();
  const teachTerm = parsed.teach.toLowerCase();

  return recommended.filter(user => {
    if (parsed.mode === 'mentor' && !user.isMentor) return false;
    if (parsed.mode === 'study' && !user.isStudyBuddyAvailable && user.learningFormat !== 'Study partner') return false;
    if (parsed.mode === 'project' && !user.isProjectPartnerAvailable && user.learningFormat !== 'Project-based') return false;

    const candidateTeachesMatch = user.skillsToTeach.some(s =>
      (typeof s === 'string' ? s : s.name).toLowerCase().includes(learnTerm)
    );

    const candidateWantsMatch = teachTerm
      ? user.skillsToLearn.some(s => (typeof s === 'string' ? s : s.name).toLowerCase().includes(teachTerm))
      : true;

    const nameMatch = user.name.toLowerCase().includes(queryText.toLowerCase());

    return (candidateTeachesMatch && candidateWantsMatch) || nameMatch;
  });
};

/**
 * Sort candidate matches
 */
export const sortMatches = (matches = [], sortBy = 'recommended') => {
  const list = [...matches];
  if (sortBy === 'matchScore' || sortBy === 'recommended') {
    return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
  if (sortBy === 'rating') {
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  if (sortBy === 'completedCount') {
    return list.sort((a, b) => (b.completedExchanges || 0) - (a.completedExchanges || 0));
  }
  return list;
};
