// EduNova Peer Exchange Workspace Real-time Message Service

const MESSAGES_KEY = 'edunova_exchange_messages_v2';

export const getExchangeMessages = (exchangeId) => {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) {
      const all = JSON.parse(raw);
      return all.filter(m => m.exchangeId === exchangeId);
    }
  } catch (e) {
    console.error('Failed to load messages', e);
  }
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
  return [];
};

export const sendExchangeMessage = (exchangeId, text, senderId = 'current_user', senderName = 'Aarav Shah', avatar = '') => {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    const all = raw ? JSON.parse(raw) : [];

    const newMessage = {
      id: `msg_${Date.now()}`,
      exchangeId,
      senderId,
      senderName,
      avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...all, newMessage];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    return newMessage;
  } catch (e) {
    console.error('Failed to send message', e);
  }
};
