// Custom Hook: useMeetings
// Centralized reactive state manager for Peer Skill Exchange Meetings

import { useState, useEffect, useCallback } from 'react';
import {
  getStoredMeetings,
  scheduleMeeting,
  getUpcomingMeetings,
  getPastMeetings,
  updateMeetingStatus,
  calculateMutualAvailableSlots
} from '../services/meetingService';

export const useMeetings = (userId = 'current_user') => {
  const [meetings, setMeetings] = useState(() => getStoredMeetings());
  const [upcoming, setUpcoming] = useState(() => getUpcomingMeetings(userId));
  const [past, setPast] = useState(() => getPastMeetings(userId));

  const refreshMeetings = useCallback(() => {
    const all = getStoredMeetings();
    setMeetings(all);
    setUpcoming(getUpcomingMeetings(userId));
    setPast(getPastMeetings(userId));
  }, [userId]);

  useEffect(() => {
    refreshMeetings();
  }, [refreshMeetings]);

  const handleCreateMeeting = (meetingData) => {
    const created = scheduleMeeting(meetingData);
    refreshMeetings();
    return created;
  };

  const handleUpdateStatus = (meetingId, newStatus) => {
    updateMeetingStatus(meetingId, newStatus);
    refreshMeetings();
  };

  return {
    meetings,
    upcomingMeetings: upcoming,
    pastMeetings: past,
    handleCreateMeeting,
    handleUpdateStatus,
    calculateMutualAvailableSlots,
    refreshMeetings
  };
};
