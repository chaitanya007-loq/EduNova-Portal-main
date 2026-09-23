// EduNova Peer Skill Exchange Meeting Service
// Handles availability overlap matching, scheduling, timezone conversion, and meeting session lifecycle.

const MEETINGS_KEY = 'edunova_skill_exchange_meetings_v2';

/**
 * Initialize meetings in storage
 */
export const getStoredMeetings = () => {
  try {
    const raw = localStorage.getItem(MEETINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load meetings', e);
  }
  localStorage.setItem(MEETINGS_KEY, JSON.stringify([]));
  return [];
};

/**
 * Save meetings to storage
 */
export const saveMeetings = (meetings) => {
  try {
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
  } catch (e) {
    console.error('Failed to save meetings', e);
  }
};

/**
 * Calculate mutually available time slots between two users for a given day
 */
export const calculateMutualAvailableSlots = (userA, userB, selectedDay = 'Saturday') => {
  const daysA = userA?.availableDays || ['Saturday', 'Sunday'];
  const daysB = userB?.availableDays || ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (!daysA.includes(selectedDay) || !daysB.includes(selectedDay)) {
    return [];
  }

  // Pre-defined time slots dictionary
  const defaultSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'];

  // Check if specific slots exist in profile
  const slotsA = userA?.availableTimeSlots?.[selectedDay] || defaultSlots;
  const slotsB = userB?.availableTimeSlots?.[selectedDay] || defaultSlots;

  // Filter overlapping slots
  const overlapping = defaultSlots.filter(slot => {
    const matchA = typeof slotsA === 'object' && Array.isArray(slotsA)
      ? slotsA.some(s => s.includes(slot.split(':')[0]))
      : true;
    const matchB = typeof slotsB === 'object' && Array.isArray(slotsB)
      ? slotsB.some(s => s.includes(slot.split(':')[0]))
      : true;
    return matchA && matchB;
  });

  return overlapping.length > 0 ? overlapping : ['05:00 PM', '06:00 PM', '07:00 PM'];
};

/**
 * Format timezone display (e.g., IST vs EST)
 */
export const getTimezoneFormatted = (timeString, timezoneHost = 'Asia/Kolkata (IST)', timezonePeer = 'Asia/Kolkata (IST)') => {
  if (timezoneHost === timezonePeer) {
    return `${timeString} (${timezoneHost.split(' ')[1] || 'IST'})`;
  }
  return `${timeString} (${timezoneHost.split(' ')[1] || 'IST'}) / Peer Local Time (${timezonePeer.split(' ')[1] || 'EST'})`;
};

/**
 * Create a new meeting
 */
export const scheduleMeeting = (meetingData) => {
  const current = getStoredMeetings();
  const newMeeting = {
    id: `mtg_${Date.now()}`,
    exchangeId: meetingData.exchangeId || 'exc_301',
    hostId: meetingData.hostId || 'current_user',
    hostName: meetingData.hostName || 'Aarav Shah',
    participantId: meetingData.participantId,
    participantName: meetingData.participantName,
    participantAvatar: meetingData.participantAvatar,
    title: meetingData.title,
    type: meetingData.type || '1-to-1 Learning',
    date: meetingData.date,
    startTime: meetingData.startTime,
    endTime: meetingData.endTime,
    duration: meetingData.duration || 60,
    timezoneHost: meetingData.timezoneHost || 'Asia/Kolkata (IST)',
    timezonePeer: meetingData.timezonePeer || 'Asia/Kolkata (IST)',
    agenda: meetingData.agenda || '1. Topic intro\n2. Q&A\n3. Next steps',
    status: 'Scheduled',
    meetingLink: `https://edunova.app/room/skill-exchange-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const updated = [newMeeting, ...current];
  saveMeetings(updated);
  return newMeeting;
};

/**
 * Get upcoming meetings for a user
 */
export const getUpcomingMeetings = (userId = 'current_user') => {
  const current = getStoredMeetings();
  return current.filter(m => (m.hostId === userId || m.participantId === userId) && m.status === 'Scheduled');
};

/**
 * Get past/completed meetings for a user
 */
export const getPastMeetings = (userId = 'current_user') => {
  const current = getStoredMeetings();
  return current.filter(m => (m.hostId === userId || m.participantId === userId) && m.status === 'Completed');
};

/**
 * Cancel or reschedule a meeting
 */
export const updateMeetingStatus = (meetingId, newStatus) => {
  const current = getStoredMeetings();
  const updated = current.map(m => m.id === meetingId ? { ...m, status: newStatus } : m);
  saveMeetings(updated);
  return updated;
};
