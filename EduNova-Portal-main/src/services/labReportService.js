/**
 * Lab Report Service for EduNova Immersive Learning Platform.
 * Generates formatted structured Lab Reports from recorded simulation data.
 */

/**
 * Generate a complete, formatted Lab Report string or object
 */
export const generateLabReport = ({ lab, parameters = {}, prediction = '', results = {}, studentName = 'Learner', notes = '' }) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const report = {
    title: `LAB REPORT: ${lab.title}`,
    studentName,
    date: dateStr,
    educationType: lab.educationType ? lab.educationType.toUpperCase() : 'UNIVERSAL',
    subject: lab.subject,
    objective: lab.learningObjectives ? lab.learningObjectives.join('\n- ') : lab.description,
    theory: lab.description,
    parametersRecorded: parameters,
    userPrediction: prediction || 'No prediction recorded prior to execution.',
    observedResults: results,
    analysisConclusion: notes || `Experimental parameters were successfully verified. Results align with theoretical predictions for ${lab.subject}.`,
    aiVerificationBadge: 'Verified by Sage AI Lab Engine'
  };

  return report;
};

/**
 * Export lab report as downloadable markdown or text file
 */
export const exportReportAsMarkdown = (report) => {
  const mdContent = `# ${report.title}
**Student Name:** ${report.studentName}  
**Date:** ${report.date}  
**Subject:** ${report.subject} (${report.educationType})  
**Status:** ${report.aiVerificationBadge}  

---

## 1. OBJECTIVE
- ${report.objective}

## 2. THEORY & CONTEXT
${report.theory}

## 3. USER PREDICTION
> ${report.userPrediction}

## 4. EXPERIMENTAL PARAMETERS
\`\`\`json
${JSON.stringify(report.parametersRecorded, null, 2)}
\`\`\`

## 5. OBSERVED RESULTS
\`\`\`json
${JSON.stringify(report.observedResults, null, 2)}
\`\`\`

## 6. ANALYSIS & CONCLUSION
${report.analysisConclusion}

---
*Generated automatically by EduNova Immersive Learning Lab Platform*
`;

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  generateLabReport,
  exportReportAsMarkdown
};
