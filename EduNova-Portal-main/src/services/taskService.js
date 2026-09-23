/**
 * EduNova Smart Task Manager Service (src/services/taskService.js)
 * High-performance task management service with local persistence.
 */

const STORAGE_KEY = 'edunova_tasks_v1';
const GOALS_KEY = 'edunova_goals_v1';

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Revise Physics Mechanics Theory & Trajectories',
    description: 'Review Newton laws, projectile motion formulas, and solved examples before practice quiz.',
    subject: 'Physics (Science)',
    topic: 'Kinematics & Dynamics',
    type: 'Study',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    estimatedDuration: 45, // mins
    difficulty: 'Medium',
    goalId: 'goal-1',
    isImportant: true,
    tags: ['Physics', 'Mechanics', 'ExamPrep'],
    subtasks: [
      { id: 'st-1', title: 'Review lecture notes on vector resolution', completed: true },
      { id: 'st-2', title: 'Derive trajectory equation for angled projectile', completed: true },
      { id: 'st-3', title: 'Solve 5 sample numerical problems', completed: false },
      { id: 'st-4', title: 'Take Sage AI 5-question micro quiz', completed: false }
    ],
    notes: 'Pay special attention to drag force coefficients and initial velocity components.'
  },
  {
    id: 'task-2',
    title: 'Complete Mathematics Quadratic Equations Assignment',
    description: 'Solve problem set 4B on page 142 including word problems on velocity and area.',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    type: 'Assignment',
    priority: 'URGENT',
    status: 'NOT_STARTED',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    estimatedDuration: 60,
    difficulty: 'Hard',
    goalId: 'goal-1',
    isImportant: true,
    tags: ['Math', 'Algebra', 'Assignment'],
    subtasks: [
      { id: 'st-201', title: 'Complete Section A basic equations', completed: false },
      { id: 'st-202', title: 'Complete Section B word problems', completed: false },
      { id: 'st-203', title: 'Verify answers using discriminant rule', completed: false }
    ],
    notes: 'Discriminant b^2 - 4ac rules for real and equal roots.'
  },
  {
    id: 'task-3',
    title: 'SQL Normalization & Indexing Lab Practice',
    description: 'Practice 1NF to 3NF schema transformations and indexing strategies in DBMS workspace.',
    subject: 'Database Systems',
    topic: 'Database Normalization',
    type: 'Practice',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    startDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    estimatedDuration: 40,
    difficulty: 'Medium',
    goalId: 'goal-2',
    isImportant: false,
    tags: ['DBMS', 'SQL', 'BTech'],
    subtasks: [
      { id: 'st-301', title: 'Identify partial dependencies for 2NF', completed: true },
      { id: 'st-302', title: 'Eliminate transitive dependencies for 3NF', completed: true }
    ],
    notes: 'Completed successfully with 100% accuracy.'
  }
];

const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'CBSE Class 10 Board Exam Mastery 2027',
    targetDate: '2027-03-15',
    targetPercentage: 90,
    milestones: [
      { id: 'm-1', title: 'Unit 1: Physics Mechanics & Energy', date: '2026-10-15', completed: false },
      { id: 'm-2', title: 'Unit 2: Chemistry Chemical Reactions', date: '2026-11-20', completed: false },
      { id: 'm-3', title: 'Unit 3: Mathematics Algebra & Geometry', date: '2026-12-25', completed: false },
      { id: 'm-4', title: 'Full Syllabus Revision & Mock Exams', date: '2027-02-10', completed: false }
    ]
  },
  {
    id: 'goal-2',
    title: 'Full Stack Web Development & DBMS DNA',
    targetDate: '2026-12-30',
    targetPercentage: 85,
    milestones: [
      { id: 'm-201', title: 'DBMS Relational Modeling & Normalization', date: '2026-10-01', completed: true },
      { id: 'm-202', title: 'REST API Design & Node.js Middleware', date: '2026-11-05', completed: false },
      { id: 'm-203', title: 'React Frontend State Management & Hooks', date: '2026-12-15', completed: false }
    ]
  }
];

class TaskService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem(GOALS_KEY)) {
      localStorage.setItem(GOALS_KEY, JSON.stringify(INITIAL_GOALS));
    }
  }

  getAllTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveAllTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('edunova_task_updated'));
    }
  }

  getAllGoals() {
    try {
      const data = localStorage.getItem(GOALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  getTasks(filters = {}) {
    let tasks = this.getAllTasks();
    const today = new Date().toISOString().split('T')[0];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        (t.topic && t.topic.toLowerCase().includes(q))
      );
    }

    if (filters.subject) {
      tasks = tasks.filter(t => t.subject === filters.subject);
    }

    if (filters.type && filters.type !== 'ALL') {
      tasks = tasks.filter(t => t.type === filters.type);
    }

    if (filters.priority && filters.priority !== 'ALL') {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }

    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'OVERDUE') {
        tasks = tasks.filter(t => t.status !== 'COMPLETED' && t.dueDate < today);
      } else if (filters.status === 'TODAY') {
        tasks = tasks.filter(t => t.dueDate === today);
      } else if (filters.status === 'UPCOMING') {
        tasks = tasks.filter(t => t.dueDate > today && t.status !== 'COMPLETED');
      } else {
        tasks = tasks.filter(t => t.status === filters.status);
      }
    }

    if (filters.importantOnly) {
      tasks = tasks.filter(t => t.isImportant);
    }

    return tasks;
  }

  getSummary() {
    const tasks = this.getAllTasks();
    const today = new Date().toISOString().split('T')[0];

    const todayTasks = tasks.filter(t => t.dueDate === today && t.status !== 'COMPLETED').length;
    const upcoming = tasks.filter(t => t.dueDate > today && t.status !== 'COMPLETED').length;
    const overdue = tasks.filter(t => t.dueDate < today && t.status !== 'COMPLETED').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const important = tasks.filter(t => t.isImportant && t.status !== 'COMPLETED').length;

    return {
      total: tasks.length,
      todayTasks,
      upcoming,
      overdue,
      completed,
      important
    };
  }

  createTask(taskData) {
    const tasks = this.getAllTasks();
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      subject: taskData.subject || 'General',
      topic: taskData.topic || '',
      type: taskData.type || 'Study',
      priority: taskData.priority || 'MEDIUM',
      status: 'NOT_STARTED',
      startDate: taskData.startDate || new Date().toISOString().split('T')[0],
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      estimatedDuration: Number(taskData.estimatedDuration) || 30,
      difficulty: taskData.difficulty || 'Medium',
      goalId: taskData.goalId || '',
      isImportant: !!taskData.isImportant,
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      notes: taskData.notes || '',
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    this.saveAllTasks(tasks);
    return newTask;
  }

  updateTask(taskId, updates) {
    const tasks = this.getAllTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...updates };
      this.saveAllTasks(tasks);
      return tasks[idx];
    }
    return null;
  }

  deleteTask(taskId) {
    let tasks = this.getAllTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    this.saveAllTasks(tasks);
    return true;
  }

  toggleSubtask(taskId, subtaskId) {
    const tasks = this.getAllTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const st = task.subtasks.find(s => s.id === subtaskId);
      if (st) {
        st.completed = !st.completed;
        
        // Auto calculate progress
        const completedCount = task.subtasks.filter(s => s.completed).length;
        if (completedCount === task.subtasks.length) {
          task.status = 'COMPLETED';
        } else if (completedCount > 0) {
          task.status = 'IN_PROGRESS';
        }
        this.saveAllTasks(tasks);
      }
    }
    return task;
  }

  rescheduleTask(taskId, newDueDate) {
    return this.updateTask(taskId, { dueDate: newDueDate });
  }

  getInsights() {
    const tasks = this.getAllTasks();
    const total = tasks.length;
    if (total === 0) {
      return {
        completedRate: 0,
        completedCount: 0,
        overdueCount: 0,
        avgDuration: 0,
        mostActiveSubject: 'None',
        streak: 0
      };
    }

    const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
    const completedRate = Math.round((completedCount / total) * 100);
    const today = new Date().toISOString().split('T')[0];
    const overdueCount = tasks.filter(t => t.dueDate < today && t.status !== 'COMPLETED').length;

    const subjects = {};
    tasks.forEach(t => {
      if (t.subject) {
        subjects[t.subject] = (subjects[t.subject] || 0) + 1;
      }
    });

    let maxSub = 'General';
    let maxCount = 0;
    Object.entries(subjects).forEach(([sub, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxSub = sub;
      }
    });

    return {
      completedRate,
      completedCount,
      overdueCount,
      avgDuration: 45,
      mostActiveSubject: maxSub,
      streak: 3
    };
  }
}

export const taskService = new TaskService();
export default taskService;
