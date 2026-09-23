// EduNova Peer Learning Network - Complete Real-time Chat Service

const CONVERSATIONS_KEY = 'edunova_conversations_v3';
const MESSAGES_KEY = 'edunova_all_chat_messages_v3';
const UNREAD_KEY = 'edunova_chat_unread_v3';

// 1. Initial Community Channels & Mock Conversations
export const INITIAL_COMMUNITY_CHANNELS = [
  { id: 'comm_general', type: 'community', title: '# General Discussion', channelName: 'General', description: 'Peer learning, study tips, and community updates', memberCount: 142, icon: 'Globe' },
  { id: 'comm_programming', type: 'community', title: '# Programming & Dev', channelName: 'Programming', description: 'JavaScript, Python, C++, Java & algorithms', memberCount: 98, icon: 'Code' },
  { id: 'comm_webdev', type: 'community', title: '# Web Development', channelName: 'Web Development', description: 'React, Next.js, Node.js, HTML/CSS & web stack', memberCount: 84, icon: 'Layout' },
  { id: 'comm_aiml', type: 'community', title: '# AI & Machine Learning', channelName: 'AI & ML', description: 'LLMs, Neural Networks, PyTorch, Prompting & Sage AI', memberCount: 110, icon: 'Sparkles' },
  { id: 'comm_uiux', type: 'community', title: '# UI/UX & Product Design', channelName: 'UI/UX', description: 'Figma design systems, auto-layout, wireframing', memberCount: 65, icon: 'Figma' },
  { id: 'comm_datasci', type: 'community', title: '# Data Science & SQL', channelName: 'Data Science', description: 'Pandas, SQL queries, data visualization & analytics', memberCount: 52, icon: 'Database' },
  { id: 'comm_examprep', type: 'community', title: '# Board & Exam Prep', channelName: 'Exam Prep', description: 'CBSE, JEE, NEET, GRE, CMAT study strategy', memberCount: 120, icon: 'Target' },
  { id: 'comm_projects', type: 'community', title: '# Project Collaboration', channelName: 'Projects', description: 'Find teammates for hackathons & portfolio projects', memberCount: 76, icon: 'FolderGit2' },
  { id: 'comm_career', type: 'community', title: '# Career & Internships', channelName: 'Career', description: 'Resume review, mock interviews, industry guidance', memberCount: 88, icon: 'Briefcase' },
  { id: 'comm_partners', type: 'community', title: '# Study Partners Network', channelName: 'Study Partners', description: 'Connect with dedicated daily study buddies', memberCount: 95, icon: 'Users' }
];

export const INITIAL_DIRECT_CONVERSATIONS = [
  {
    id: 'conv_rahul',
    type: 'exchange',
    title: 'React ↔ UI/UX Exchange',
    participant: {
      id: 'usr_peer_1',
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'UI/UX Design Specialist',
      online: true,
      status: 'Online',
      teaching: 'Figma & UI/UX Design',
      learning: 'React & Hooks'
    },
    exchangeId: 'exc_301',
    unreadCount: 2,
    lastMessage: 'Ready for today\'s React session?',
    lastMessageTime: '10:45 AM'
  },
  {
    id: 'conv_meera',
    type: 'direct',
    title: 'Meera Patel',
    participant: {
      id: 'usr_peer_2',
      name: 'Meera Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      title: 'Python & Data Science Aspirant',
      online: true,
      status: 'Online',
      teaching: 'Python Basics',
      learning: 'Data Structures'
    },
    exchangeId: null,
    unreadCount: 1,
    lastMessage: 'Can you check this PDF notes document?',
    lastMessageTime: '18m ago'
  },
  {
    id: 'conv_ai_project',
    type: 'group',
    title: 'AI Education Platform Project',
    participantsCount: 4,
    members: [
      { name: 'Priya Verma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Verma', role: 'UI/UX' },
      { name: 'Rahul Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Frontend' },
      { name: 'Aarav Shah (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'Fullstack' },
      { name: 'Dev Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Backend' }
    ],
    unreadCount: 0,
    lastMessage: 'Session scheduled for Friday 7:00 PM',
    lastMessageTime: '1h ago'
  }
];

export const INITIAL_MESSAGES_LIST = [
  {
    id: 'msg_comm_gen_1',
    conversationId: 'comm_general',
    senderId: 'usr_peer_1',
    senderName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Welcome to EduNova Peer Learning Network! Feel free to ask questions and share resources.',
    timestamp: '10:00 AM',
    reactions: { '👍': 4, '🔥': 2 },
    isPinned: true
  },
  {
    id: 'msg_comm_gen_2',
    conversationId: 'comm_general',
    senderId: 'usr_peer_2',
    senderName: 'Meera Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Can anyone recommend good practice problems for React state management & custom hooks?',
    timestamp: '10:15 AM',
    reactions: { '💡': 3 }
  },
  {
    id: 'msg_comm_aiml_1',
    conversationId: 'comm_aiml',
    senderId: 'usr_peer_3',
    senderName: 'Dev Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Welcome to # AI & Machine Learning! Discuss neural networks, LLM prompting, and Sage AI models here.',
    timestamp: '09:30 AM',
    reactions: { '🔥': 5, '💡': 2 },
    isPinned: true
  },
  {
    id: 'msg_comm_aiml_2',
    conversationId: 'comm_aiml',
    senderId: 'usr_peer_1',
    senderName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Anyone building custom fine-tuned models for student study assistants? Sage AI API works great for this!',
    timestamp: '10:05 AM',
    reactions: { '👍': 3 }
  },
  {
    id: 'msg_comm_prog_1',
    conversationId: 'comm_programming',
    senderId: 'usr_peer_2',
    senderName: 'Meera Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Welcome to # Programming & Dev! Share C++, Python, Java & LeetCode problem solutions here.',
    timestamp: '08:45 AM',
    reactions: { '👏': 4 }
  },
  {
    id: 'msg_comm_webdev_1',
    conversationId: 'comm_webdev',
    senderId: 'usr_peer_1',
    senderName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Welcome to # Web Development! Discuss React 19, Next.js, Vite, Tailwind & CSS architecture.',
    timestamp: '09:12 AM',
    reactions: { '🔥': 6 }
  },
  {
    id: 'msg_comm_uiux_1',
    conversationId: 'comm_uiux',
    senderId: 'usr_peer_1',
    senderName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Welcome to # UI/UX & Product Design! Post Figma auto-layout tips, glassmorphism wireframes, and design tokens.',
    timestamp: '09:50 AM',
    reactions: { '❤️': 3 }
  },
  {
    id: 'msg_rahul_1',
    conversationId: 'conv_rahul',
    senderId: 'usr_peer_1',
    senderName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Hey Aarav! Ready for today\'s React & Figma skill exchange session at 7 PM?',
    timestamp: 'Yesterday 04:30 PM',
    reactions: { '👍': 1 }
  },
  {
    id: 'msg_rahul_2',
    conversationId: 'conv_rahul',
    senderId: 'current_user',
    senderName: 'Aarav Shah',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Yes! I have prepared custom hook code examples for useState and useEffect.',
    timestamp: 'Yesterday 04:45 PM',
    status: 'read'
  },
  {
    id: 'msg_rahul_3',
    conversationId: 'conv_rahul',
    senderId: 'usr_peer_1',
    senderName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Can you explain React useEffect cleanup function in detail?',
    timestamp: '10:45 AM',
    reactions: { '❤️': 1 }
  },
  {
    id: 'msg_meera_1',
    conversationId: 'conv_meera',
    senderId: 'usr_peer_2',
    senderName: 'Meera Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: 'Can you check this PDF notes document on Python Data Structures?',
    timestamp: '18m ago'
  }
];

// 2. Service API Methods
export const getConversationsList = () => {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load conversations', e);
  }
  const initial = [...INITIAL_COMMUNITY_CHANNELS, ...INITIAL_DIRECT_CONVERSATIONS];
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(initial));
  return initial;
};

export const getConversationById = (conversationId) => {
  const list = getConversationsList();
  return list.find(c => c.id === conversationId) || list[0];
};

export const getMessagesForConversation = (conversationId) => {
  let allMsgs = INITIAL_MESSAGES_LIST;
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) {
      allMsgs = JSON.parse(raw);
    } else {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES_LIST));
    }
  } catch (e) {
    console.error('Failed to load messages', e);
  }

  const msgs = allMsgs.filter(m => m.conversationId === conversationId);
  if (msgs.length > 0) return msgs;

  // Fallback: Generate dynamic welcome seed message for channels without messages yet
  const conv = getConversationById(conversationId);
  const seedMsg = {
    id: `msg_seed_${conversationId}_${Date.now()}`,
    conversationId,
    senderId: 'usr_system',
    senderName: 'EduNova Community Bot',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    type: 'text',
    text: `Welcome to ${conv?.title || conv?.channelName || 'this channel'}! Start the peer discussion, ask questions, or share study materials.`,
    timestamp: 'Just now',
    reactions: { '💡': 1 }
  };
  const updatedAll = [...allMsgs, seedMsg];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedAll));
  return [seedMsg];
};

export const sendChatMessage = ({
  conversationId,
  text = '',
  type = 'text',
  attachment = null,
  replyTo = null,
  learningCard = null,
  meetingRequest = null,
  peerQuiz = null,
  senderId = 'current_user',
  senderName = 'Aarav Shah',
  avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
}) => {
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId,
    senderId,
    senderName,
    avatar,
    type,
    text,
    attachment,
    replyTo,
    learningCard,
    meetingRequest,
    peerQuiz,
    reactions: {},
    isPinned: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent'
  };

  try {
    let all = INITIAL_MESSAGES_LIST;
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) {
      try { all = JSON.parse(raw); } catch (e) {}
    }

    const updated = [...all, newMessage];
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    } catch (quotaError) {
      console.warn('LocalStorage quota limit reached, trimming oldest messages');
      // Keep latest 50 messages to free quota
      const trimmed = updated.slice(-50);
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(trimmed));
    }

    // Update conversation preview
    const conversations = getConversationsList();
    const updatedConversations = conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text || (attachment ? `Sent attachment: ${attachment.name}` : 'New message'),
          lastMessageTime: 'Just now'
        };
      }
      return c;
    });
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
    } catch (e) {}

  } catch (e) {
    console.error('Failed to save message to localStorage', e);
  }

  return newMessage;
};

export const toggleMessageReaction = (messageId, emojiSymbol, currentUserId = 'current_user') => {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    const all = raw ? JSON.parse(raw) : INITIAL_MESSAGES_LIST;

    const updated = all.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...(msg.reactions || {}) };
        const currentCount = reactions[emojiSymbol] || 0;
        reactions[emojiSymbol] = currentCount + 1;
        return { ...msg, reactions };
      }
      return msg;
    });

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle reaction', e);
  }
};

export const togglePinMessage = (messageId) => {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    const all = raw ? JSON.parse(raw) : INITIAL_MESSAGES_LIST;

    const updated = all.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, isPinned: !msg.isPinned };
      }
      return msg;
    });

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to pin message', e);
  }
};

export const getUnreadMessageCount = () => {
  const conversations = getConversationsList();
  return conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
};

export const markConversationAsRead = (conversationId) => {
  const conversations = getConversationsList();
  const updated = conversations.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
  return updated;
};

export const ensureExchangeConversation = (exchange) => {
  if (!exchange) return null;
  const conversations = getConversationsList();
  const existing = conversations.find(c => c.exchangeId === exchange.id || (c.type === 'exchange' && c.participant?.id === exchange.peerId));

  if (existing) return existing;

  const newConv = {
    id: `conv_exc_${exchange.id}`,
    type: 'exchange',
    title: `${exchange.userSkill} ↔ ${exchange.peerSkill} Exchange`,
    participant: {
      id: exchange.peerId || 'usr_peer_x',
      name: exchange.peerName || 'Peer Learner',
      avatar: exchange.peerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: exchange.peerTitle || 'Skill Peer',
      online: true,
      status: 'Online',
      teaching: exchange.peerSkill,
      learning: exchange.userSkill
    },
    exchangeId: exchange.id,
    unreadCount: 0,
    lastMessage: 'Active skill exchange started',
    lastMessageTime: 'Just now'
  };

  const updated = [newConv, ...conversations];
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
  return newConv;
};

// --- LEGACY SAGE AI CONVERSATION HISTORIES FOR AIChatContext ---
const INITIAL_SAGE_MESSAGES = [
  {
    id: 'msg_1',
    sender: 'sage',
    text: "Hello! I am Sage, your AI Teaching Assistant. How can I help accelerate your learning path today?",
    timestamp: '10:00 AM'
  }
];

export const getChatHistory = () => {
  try {
    const stored = localStorage.getItem('edunova_chat_history');
    return stored ? JSON.parse(stored) : INITIAL_SAGE_MESSAGES;
  } catch (e) {
    return INITIAL_SAGE_MESSAGES;
  }
};

export const saveChatMessage = (message) => {
  const current = getChatHistory();
  const updated = [...current, message];
  localStorage.setItem('edunova_chat_history', JSON.stringify(updated));
  return updated;
};

export const clearChatHistory = () => {
  localStorage.removeItem('edunova_chat_history');
  return INITIAL_SAGE_MESSAGES;
};
