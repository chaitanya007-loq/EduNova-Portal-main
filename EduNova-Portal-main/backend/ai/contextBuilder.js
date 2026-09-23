/**
 * Sage AI — Context Builder Engine
 * 
 * Aggregates live student data from PostgreSQL (LearnerProfile, enrolled subjects,
 * weak topics, streak, level) and formats targeted prompt constraints.
 */

const prisma = require('../config/db');
const { buildTutorSystemPrompt } = require('./prompts/tutorPrompt');

class ContextBuilder {
  /**
   * Fetches full learner profile, subject enrollments, and weak topics
   * @param {string} userId 
   */
  async buildStudentContext(userId) {
    if (!userId) {
      return {
        studentName: 'Learner',
        learnerType: 'SCHOOL',
        board: 'CBSE',
        degree: null,
        level: 1,
        goals: [],
        weakTopics: [],
        streakDays: 0,
        enrolledSubjects: [],
      };
    }

    const [user, profile, subjectProgress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          learnerType: true,
          role: true,
        },
      }),
      prisma.learnerProfile.findUnique({
        where: { userId },
      }),
      prisma.studentSubjectProgress.findMany({
        where: { userId },
        include: {
          subject: {
            select: { name: true, category: true, class: true, board: true },
          },
        },
        take: 5,
      }),
    ]);

    const studentName = user?.name || 'Learner';
    const learnerType = user?.learnerType || 'SCHOOL';
    const board = profile?.board || 'Standard';
    const degree = profile?.degree || null;
    const level = profile?.level || 1;
    const goals = profile?.goals || [];
    const weakTopics = profile?.weakTopics || [];
    const streakDays = profile?.streakDays || 0;
    const xp = profile?.xp || 0;

    const enrolledSubjects = subjectProgress.map((sp) => ({
      name: sp.subject?.name,
      progress: sp.progress,
      syllabusCoverage: sp.syllabusCoverage,
    }));

    return {
      userId,
      studentName,
      learnerType,
      board,
      degree,
      level,
      goals,
      weakTopics,
      streakDays,
      xp,
      enrolledSubjects,
    };
  }

  /**
   * Generates the dynamic tutor system instruction customized for this student
   * @param {string} userId 
   */
  async getTutorSystemInstruction(userId) {
    const context = await this.buildStudentContext(userId);
    return buildTutorSystemPrompt(context);
  }
}

module.exports = new ContextBuilder();
