// EduNova Subject Image Mapping & Fallback Visual System
// High quality 16:9 landscape image mappings for every subject and category

export const subjectImages = {
  // School Subjects
  'sch_math_10': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80', // Mathematics equations & geometry
  'sch_physics_10': 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&auto=format&fit=crop&q=80', // Physics optics & circuits
  'sch_chem_10': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&auto=format&fit=crop&q=80', // Chemistry lab reactions
  'sch_bio_10': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&auto=format&fit=crop&q=80', // Biology DNA & cells
  'sch_eng_10': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80', // English literature & books
  'sch_sst_10': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80', // History & Social Science
  'sch_cs_10': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80', // Computer Applications code

  // College Subjects
  'col_dbms_sem5': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80', // Database architecture SQL
  'col_os_sem5': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80', // Operating Systems & code
  'col_cn_sem5': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80', // Computer Networks servers
  'col_dsa_sem5': 'https://images.unsplash.com/photo-1516116211223-4258568f1013?w=1200&auto=format&fit=crop&q=80', // Data Structures algorithms
  'col_web_sem5': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80', // Web Engineering React
  'col_se_sem5': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80', // Software Engineering teamwork
  'col_ai_sem5': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80', // AI & Neural Networks
  
  // BBA / Business Subjects
  'col_marketing_bba': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&auto=format&fit=crop&q=80', // Marketing strategy
  'col_finance_bba': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80', // Business Finance & stock chart
  'col_hr_bba': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80', // HR & Leadership

  // Exam Preparation Subjects
  'exm_quant': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&auto=format&fit=crop&q=80', // Quantitative Aptitude math
  'exm_reasoning': 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&auto=format&fit=crop&q=80', // Logical Reasoning puzzles
  'exm_english': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80', // Verbal Ability reading
  'exm_gk': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80', // General Awareness current affairs

  // Skills & Career Subjects
  'skl_fullstack': 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&auto=format&fit=crop&q=80', // Full Stack web dev
  'skl_uiux': 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&auto=format&fit=crop&q=80', // UI/UX design wireframes
  'skl_backend': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80', // Backend APIs Node
  'skl_devops': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&auto=format&fit=crop&q=80', // Docker & Kubernetes DevOps
  'skl_datascience': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80' // Data Science analytics
};

/**
 * Returns mapped image for subject ID, or subject-specific SVG visual fallback if missing.
 */
export const getSubjectImage = (subject) => {
  if (subject && subjectImages[subject.id]) {
    return subjectImages[subject.id];
  }
  if (subject && subject.image) {
    return subject.image;
  }

  // Topic category fallback images
  const cat = (subject?.category || subject?.name || '').toLowerCase();
  if (cat.includes('math')) return subjectImages['sch_math_10'];
  if (cat.includes('physic')) return subjectImages['sch_physics_10'];
  if (cat.includes('chem')) return subjectImages['sch_chem_10'];
  if (cat.includes('bio')) return subjectImages['sch_bio_10'];
  if (cat.includes('data') || cat.includes('dbms')) return subjectImages['col_dbms_sem5'];
  if (cat.includes('operat') || cat.includes('os')) return subjectImages['col_os_sem5'];
  if (cat.includes('code') || cat.includes('web') || cat.includes('program')) return subjectImages['skl_fullstack'];
  if (cat.includes('quant')) return subjectImages['exm_quant'];
  if (cat.includes('reason')) return subjectImages['exm_reasoning'];

  // Universal high-res futuristic tech fallback
  return 'https://images.unsplash.com/photo-1516116211223-4258568f1013?w=1200&auto=format&fit=crop&q=80';
};
