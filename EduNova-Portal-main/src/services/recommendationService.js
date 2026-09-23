// EduNova Recommendation Service based on actual student progress data

import { subjectService } from './subjectService';

class RecommendationService {
  getDashboardRecommendation(learnerType = 'college') {
    const selectedSubjects = subjectService.getSelectedSubjects(learnerType);
    if (!selectedSubjects || selectedSubjects.length === 0) {
      return {
        title: 'Select Your Current Subjects',
        text: 'Add your active subjects to receive personalized study recommendations, formula sheets, and Sage AI tutoring.',
        subjectName: 'My Subjects',
        actionText: 'Choose Subjects',
        actionType: 'select'
      };
    }

    // Find subject with lowest progress or weak topic
    const lowestSubject = [...selectedSubjects].sort((a, b) => (a.defaultProgress || 50) - (b.defaultProgress || 50))[0];

    return {
      title: `Sage Recommendation: ${lowestSubject.name}`,
      text: `Your current progress in ${lowestSubject.name} is ${lowestSubject.defaultProgress || 54}%. Focus on "${lowestSubject.weakTopic || lowestSubject.currentChapter}" before your next evaluation.`,
      subjectId: lowestSubject.id,
      subjectName: lowestSubject.name,
      weakTopic: lowestSubject.weakTopic || lowestSubject.currentChapter,
      actionText: `Practice ${lowestSubject.weakTopic || 'Weak Topic'}`,
      actionType: 'open_subject'
    };
  }

  getSubjectRecommendations(subjectId) {
    const subject = subjectService.getSubjectById(subjectId);
    return [
      {
        title: `📖 ${subject.weakTopic || subject.currentChapter} Revision Notes`,
        desc: 'Concise summary of key concepts, formulas & solved examples.',
        type: 'Notes'
      },
      {
        title: `🧠 ${subject.name} Active Recall Flashcards`,
        desc: '10 quick flip cards to test recall speed.',
        type: 'Flashcards'
      },
      {
        title: `🎯 5-Question Diagnostic Practice Quiz`,
        desc: 'Test your understanding and receive instant AI feedback.',
        type: 'Quiz'
      }
    ];
  }
}

export const recommendationService = new RecommendationService();
export default recommendationService;
