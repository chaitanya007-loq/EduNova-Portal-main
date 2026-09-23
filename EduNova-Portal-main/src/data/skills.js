export const skillConstellationData = {
  nodes: [
    { id: 'prog_base', name: 'Programming Fundamentals', category: 'Core', status: 'mastered', progress: 100, xp: 500, description: 'Core logic, control flows, data types, and modular execution.' },
    { id: 'js_core', name: 'JavaScript ES6+', category: 'Frontend', status: 'mastered', progress: 100, xp: 450, description: 'Promises, Async/Await, Closures, DOM manipulation, functional paradigms.' },
    { id: 'react_core', name: 'React Architecture', category: 'Frontend', status: 'learning', progress: 78, xp: 350, description: 'Hooks, Virtual DOM, Context, Routing, state management patterns.' },
    { id: 'ui_design', name: 'UI/UX & Design Systems', category: 'Design', status: 'learning', progress: 60, xp: 280, description: 'Color theory, dark mode contrast, layout geometry, micro-interactions.' },
    { id: 'webgl_3d', name: '3D WebGL & XR', category: 'Immersive', status: 'locked', progress: 10, xp: 0, description: 'Canvas rendering, camera vectors, lighting shaders, WebXR spatial input.' },
    { id: 'ai_ml', name: 'AI & Neural Networks', category: 'AI', status: 'learning', progress: 40, xp: 200, description: 'Prompt engineering, model pipelines, transformer attention, embeddings.' },
    { id: 'fullstack_api', name: 'Full-Stack Integration', category: 'Backend', status: 'locked', progress: 0, xp: 0, description: 'REST/GraphQL endpoints, database schemas, authentication flow, cloud storage.' }
  ],
  links: [
    { source: 'prog_base', target: 'js_core' },
    { source: 'js_core', target: 'react_core' },
    { source: 'react_core', target: 'ui_design' },
    { source: 'react_core', target: 'webgl_3d' },
    { source: 'js_core', target: 'fullstack_api' },
    { source: 'prog_base', target: 'ai_ml' }
  ]
};

export const skillDnaMetrics = [
  { subject: 'Problem Solving', score: 84, fullMark: 100, growth: '+6%' },
  { subject: 'Programming', score: 78, fullMark: 100, growth: '+12%' },
  { subject: 'Creativity & UI', score: 68, fullMark: 100, growth: '+8%' },
  { subject: 'Communication', score: 62, fullMark: 100, growth: '+4%' },
  { subject: 'Mathematics & ML', score: 72, fullMark: 100, growth: '+15%' },
  { subject: 'System Design', score: 55, fullMark: 100, growth: '+10%' }
];
