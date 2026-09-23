import React, { useState } from 'react';
import { X, Calendar, Clock, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { calculateMutualAvailableSlots, getTimezoneFormatted } from '../../services/meetingService';

export const MeetingSchedulerModal = ({ isOpen, onClose, peerUser, exchange, onScheduleSuccess }) => {
  const [selectedDay, setSelectedDay] = useState('Saturday');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [duration, setDuration] = useState(60);
  const [meetingType, setMeetingType] = useState('1-to-1 Learning');
  const [agenda, setAgenda] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedMeeting, setConfirmedMeeting] = useState(null);

  if (!isOpen || !peerUser) return null;

  const currentUser = {
    availableDays: ['Saturday', 'Sunday', 'Monday'],
    timezone: 'Asia/Kolkata (IST)'
  };

  // Calculate mutually available overlapping slots
  const availableSlots = calculateMutualAvailableSlots(currentUser, peerUser, selectedDay);

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!selectedTimeSlot) return;

    const meetingData = {
      exchangeId: exchange?.id || 'exc_301',
      participantId: peerUser.id,
      participantName: peerUser.name,
      participantAvatar: peerUser.avatar,
      title: `${exchange?.userSkill || 'React'} ↔ ${exchange?.peerSkill || peerUser.skillsToTeach?.[0]?.name || 'UI/UX'} Session`,
      type: meetingType,
      date: selectedDate,
      startTime: selectedTimeSlot,
      endTime: '08:00 PM',
      duration: Number(duration),
      timezoneHost: currentUser.timezone,
      timezonePeer: peerUser.timezone || 'Asia/Kolkata (IST)',
      agenda: agenda || `1. Discuss ${exchange?.userSkill || 'React'}\n2. Practice ${exchange?.peerSkill || 'Figma'}`
    };

    if (onScheduleSuccess) {
      const created = onScheduleSuccess(meetingData);
      setConfirmedMeeting(created || meetingData);
      setIsConfirmed(true);
    }
  };

  return (
    <div className="se-modal-overlay">
      <div className="se-modal-box">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Schedule Peer Session</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Comparing mutual availability with {peerUser.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {isConfirmed ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <CheckCircle size={48} color="#34d399" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>Meeting Scheduled!</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
              Your session with <span style={{ color: '#38bdf8', fontWeight: 700 }}>{peerUser.name}</span> is confirmed.
            </p>

            <div style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.12)', maxWidth: '360px', margin: '0 auto 24px auto', textAlign: 'left', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Date & Time:</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{confirmedMeeting?.date} at {confirmedMeeting?.startTime}</span>
              </div>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Duration:</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{confirmedMeeting?.duration} mins</span>
              </div>
            </div>

            <button onClick={onClose} className="se-btn se-btn-primary">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Peer info summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '14px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <img src={peerUser.avatar} alt={peerUser.name} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: 0 }}>{peerUser.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{peerUser.title}</p>
              </div>
            </div>

            {/* Day Selection */}
            <div>
              <label className="se-form-label">
                1. Select Available Day
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                  const isAvailable = peerUser.availableDays?.includes(day);
                  const isSelected = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => { setSelectedDay(day); setSelectedTimeSlot(''); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: isSelected ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.12)',
                        background: isSelected ? '#06b6d4' : isAvailable ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                        color: isSelected ? '#050814' : isAvailable ? '#ffffff' : '#64748b',
                        cursor: isAvailable ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="se-form-label">
                  Session Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="se-form-input"
                />
              </div>

              <div>
                <label className="se-form-label">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="se-form-select"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (Recommended)</option>
                  <option value={90}>90 Minutes</option>
                  <option value={120}>120 Minutes</option>
                </select>
              </div>
            </div>

            {/* Mutually Available Overlapping Time Slots */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="se-form-label" style={{ margin: 0 }}>
                  2. Select Overlapping Available Slot
                </label>
                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>✓ Showing Overlap Only</span>
              </div>

              {availableSlots.length === 0 ? (
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} />
                  No overlapping slots found for {selectedDay}. Pick another day.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        style={{
                          padding: '8px',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: isSelected ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.12)',
                          background: isSelected ? '#06b6d4' : '#050814',
                          color: isSelected ? '#050814' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Session Type */}
            <div>
              <label className="se-form-label">
                3. Session Type
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['1-to-1 Learning', 'Mentoring', 'Study Session', 'Project Collaboration', 'Interview Practice'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMeetingType(type)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: meetingType === type ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.12)',
                      background: meetingType === type ? 'rgba(168, 85, 247, 0.18)' : '#050814',
                      color: meetingType === type ? '#c084fc' : '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div>
              <label className="se-form-label">
                4. Agenda / Notes
              </label>
              <textarea
                rows={3}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="e.g. 1. Review React Hooks\n2. Solve UI layout issue"
                className="se-form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <button type="button" onClick={onClose} className="se-btn se-btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedTimeSlot}
                className="se-btn se-btn-primary"
                style={{ opacity: selectedTimeSlot ? 1 : 0.5, cursor: selectedTimeSlot ? 'pointer' : 'not-allowed' }}
              >
                Confirm Schedule
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
