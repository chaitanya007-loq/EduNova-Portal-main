/**
 * EduNova Centralized Dashboard Context Engine
 * Dynamically resolves and manages full learner context (school, college, exam, skills)
 * and evaluates next best actions based on real learning data.
 */

import educationContextService from './educationContextService';
import { learnerService } from './learnerService';
import { subjectService } from './subjectService';

export const getDashboardContext = () => {
  const learner = learnerService?.getProfile ? learnerService.getProfile() : null;
  const eduContext = educationContextService.getEducationContext(learner);
  const selectedSubjects = subjectService.getSelectedSubjects();

  const type = (learner?.learnerType || eduContext?.educationType || 'college').toLowerCase();

  return {
    educationType: type,
    classLevel: learner?.classLevel || eduContext?.classLevel || 'Class 10',
    board: learner?.board || eduContext?.board || 'CBSE',
    degree: learner?.degree || eduContext?.degree || 'B.Tech',
    branch: learner?.branch || eduContext?.branch || 'Computer Science & Engineering',
    semester: learner?.semester || eduContext?.semester || 5,
    examTarget: learner?.exam || eduContext?.examTarget || 'JEE Advanced',
    targetDate: learner?.targetDate || '2026-05-15',
    selectedSubjects: selectedSubjects || [],
    learningGoals: learner?.goals || ['Master core concepts', 'Achieve top accuracy'],
    streakDays: learner?.streakDays || 14,
    careerGoal: learner?.careerGoal || (type === 'college' ? 'Full Stack Engineer' : type === 'skills' ? 'AI / ML Specialist' : 'Academic Excellence'),
    learner
  };
};

/**
 * Universal "What Should I Do Now?" recommendation generator
 */
export const getNextBestAction = () => {
  const ctx = getDashboardContext();
  const type = ctx.educationType;

  if (type === 'school') {
    return {
      title: 'Physics — Reflection & Spherical Mirrors',
      subjectId: 'physics',
      estimatedTime: '30 mins',
      reason: 'Revision due today • Board exam in 68 days',
      actionText: 'Start Revision Session',
      type: 'REVISION',
      sageTip: 'Sage recommends tackling 5 practice questions on Mirror Formula first.'
    };
  } else if (type === 'college') {
    return {
      title: 'Data Structures — Binary Search Trees & Heap Ops',
      subjectId: 'dsa',
      estimatedTime: '45 mins',
      reason: 'Semester 5 Internal Exam approaching • Assignment 2 due in 3 days',
      actionText: 'Open Assignment & Practice',
      type: 'ASSIGNMENT',
      sageTip: 'Sage recommends building a BST deletion test case in the Lab.'
    };
  } else if (type === 'exam') {
    return {
      title: 'Mathematics — Quadratic Equations & Discriminant',
      subjectId: 'maths',
      estimatedTime: '40 mins',
      reason: 'Recent Mock Accuracy was 68% (Needs improvement) • 4 mistakes in Calculation',
      actionText: 'Take Practice Quiz',
      type: 'MOCK_PRACTICE',
      sageTip: 'Focus on root-coefficient relations and extreme values.'
    };
  } else {
    return {
      title: 'Full Stack — REST API & Express Controller Architecture',
      subjectId: 'fullstack',
      estimatedTime: '50 mins',
      reason: 'Skill Gap Analysis: REST API mastery required for target role Full Stack Dev',
      actionText: 'Continue Project Module',
      type: 'PROJECT',
      sageTip: 'Complete JWT authentication handler in your portfolio project.'
    };
  }
};

export default {
  getDashboardContext,
  getNextBestAction
};
