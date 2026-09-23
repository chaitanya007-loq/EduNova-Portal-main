// EduNova Isolated Storage Initial Mock State for Peer Skill Exchange

export const initialMockRequests = [
  {
    id: 'req_101',
    fromUserId: 'usr_peer_1',
    fromUser: {
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'UI/UX Design Specialist',
      verified: true
    },
    toUserId: 'current_user',
    requestedSkill: 'React',
    offeredSkill: 'UI/UX Design',
    message: 'Hey Aarav! I saw you know React state management and hooks. I can teach you advanced Figma component architecture and prototyping in exchange!',
    status: 'Pending',
    createdAt: '2026-09-17T10:30:00Z',
    matchScore: 94
  },
  {
    id: 'req_102',
    fromUserId: 'usr_peer_3',
    fromUser: {
      name: 'Dev Patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      title: 'Backend Node.js Developer',
      verified: true
    },
    toUserId: 'current_user',
    requestedSkill: 'React',
    offeredSkill: 'Node.js & SQL',
    message: 'Hi! Looking for a peer exchange to build a full-stack dashboard project together.',
    status: 'Pending',
    createdAt: '2026-09-16T14:15:00Z',
    matchScore: 88
  }
];

export const initialMockActiveExchanges = [
  {
    id: 'exc_301',
    peerId: 'usr_peer_1',
    peerName: 'Rahul Sharma',
    peerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    peerTitle: 'UI/UX Design Specialist',
    userSkill: 'React Components & Hooks',
    peerSkill: 'Figma Design Systems',
    status: 'Active',
    startedAt: '2026-09-01T00:00:00Z',
    progress: 65,
    sessionsCompleted: 3,
    totalTeachingHours: 4.5,
    totalLearningHours: 4.5,
    lastActivity: '2 hours ago',
    nextMeeting: {
      id: 'mtg_501',
      date: '2026-09-20',
      time: '07:00 PM',
      title: 'React Hooks & Context Architecture'
    }
  }
];

export const initialMockMeetings = [
  {
    id: 'mtg_501',
    exchangeId: 'exc_301',
    hostId: 'current_user',
    hostName: 'Aarav Shah',
    participantId: 'usr_peer_1',
    participantName: 'Rahul Sharma',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'React Hooks & Context Architecture',
    type: '1-to-1 Learning',
    date: '2026-09-20',
    startTime: '07:00 PM',
    endTime: '08:00 PM',
    duration: 60,
    timezoneHost: 'Asia/Kolkata (IST)',
    timezonePeer: 'Asia/Kolkata (IST)',
    agenda: '1. Review useState and useEffect patterns\n2. Discuss custom hooks for API calls\n3. Q&A and hands-on coding',
    status: 'Scheduled',
    meetingLink: 'https://edunova.app/room/skill-exchange-301'
  },
  {
    id: 'mtg_502',
    exchangeId: 'exc_301',
    hostId: 'usr_peer_1',
    hostName: 'Rahul Sharma',
    participantId: 'current_user',
    participantName: 'Aarav Shah',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Figma Design System Components',
    type: 'Mentoring',
    date: '2026-09-14',
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    duration: 60,
    timezoneHost: 'Asia/Kolkata (IST)',
    timezonePeer: 'Asia/Kolkata (IST)',
    agenda: 'Figma Auto Layout and Component Variants',
    status: 'Completed',
    meetingLink: 'https://edunova.app/room/skill-exchange-301'
  }
];

export const initialMockNotes = [
  {
    id: 'note_1',
    exchangeId: 'exc_301',
    title: 'Session #2: Custom React Hooks & State Management',
    content: `### Key Learnings:
- **Custom Hooks**: Encapsulate reusable logic (e.g., \`useFetch\`, \`useDebounce\`).
- **Context API**: Best for global UI theme, auth session, and user profile state. Avoid over-nesting providers.

### Action Items for Next Session:
1. Rahul to implement \`useSkillExchange\` custom hook in dev sandbox.
2. Aarav to share wireframe design for landing hero section in Figma.`,
    updatedAt: '2026-09-15T18:30:00Z',
    author: 'Rahul Sharma'
  }
];

export const initialMockGoals = [
  {
    id: 'goal_1',
    exchangeId: 'exc_301',
    title: 'Master React State & Context API',
    category: 'React',
    progress: 75,
    milestones: [
      { id: 'm1', text: 'Understand useState & useEffect hooks', completed: true },
      { id: 'm2', text: 'Build custom custom hooks (useFetch, useDebounce)', completed: true },
      { id: 'm3', text: 'Set up React Context for global state', completed: true },
      { id: 'm4', text: 'Implement performance optimization (useMemo, useCallback)', completed: false }
    ]
  },
  {
    id: 'goal_2',
    exchangeId: 'exc_301',
    title: 'Design System & Auto-Layout in Figma',
    category: 'UI/UX Design',
    progress: 50,
    milestones: [
      { id: 'm5', text: 'Learn Figma Auto-Layout v5', completed: true },
      { id: 'm6', text: 'Create component variants & properties', completed: true },
      { id: 'm7', text: 'Define design tokens (Colors, Typography, Elevation)', completed: false },
      { id: 'm8', text: 'Publish interactive prototype', completed: false }
    ]
  }
];

export const initialMockMessages = [
  {
    id: 'msg_1',
    exchangeId: 'exc_301',
    senderId: 'usr_peer_1',
    senderName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'Hey Aarav! Excited for our upcoming session on Sunday.',
    timestamp: 'Yesterday at 04:30 PM'
  },
  {
    id: 'msg_2',
    exchangeId: 'exc_301',
    senderId: 'current_user',
    senderName: 'Aarav Shah',
    text: 'Hey Rahul! Same here. I have prepared the code sample for Context API.',
    timestamp: 'Yesterday at 04:45 PM'
  }
];
