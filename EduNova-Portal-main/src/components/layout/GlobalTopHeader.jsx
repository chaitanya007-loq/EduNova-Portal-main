import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Check,
  BarChart2,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { GlobalSearchInput } from '../common/GlobalSearchInput';
import { getDynamicAvatar } from '../../utils/avatarUtils';

export const GlobalTopHeader = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const isLight = theme === 'light';

  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside listener for dropdown menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotificationsMenu(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine dynamic placeholder based on current route
  const getDynamicPlaceholder = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/subjects')) return 'Search My Subjects, chapters, notes...';
    if (path.includes('/constellation')) return 'Search skills, graph nodes, topics...';
    if (path.includes('/xr-studio')) return 'Search 3D XR labs, physics simulations...';
    if (path.includes('/chat') || path.includes('/ai-assistant')) return 'Search Sage AI topics, ask doubts...';
    if (path.includes('/skill-marketplace')) return 'Search skill barter listings, peer mentors...';
    if (path.includes('/planner') || path.includes('/study-planner')) return 'Search study planner tasks, schedules...';
    if (path.includes('/analytics')) return 'Search performance metrics, skill radar...';
    return 'Search subjects, courses, skills...';
  };

  const fullName = user?.name || user?.username || 'EduNova User';
  const userAvatar = getDynamicAvatar(user, fullName);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px',
        width: '100%'
      }}
    >
      {/* 1. DYNAMIC GLOBAL SEARCH INPUT PILL */}
      <div style={{ flex: 1, minWidth: '240px' }}>
        <GlobalSearchInput isLight={isLight} placeholder={getDynamicPlaceholder()} />
      </div>

      {/* 2. TOP RIGHT CONTROLS & DROPDOWNS */}
      <div ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', flexShrink: 0 }}>
        
        {/* Notification Button & Glass Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotificationsMenu(prev => !prev);
              setShowProfileMenu(false);
            }}
            aria-label="Notifications"
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: showNotificationsMenu ? 'rgba(56, 189, 248, 0.22)' : (isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
              border: showNotificationsMenu ? '1px solid rgba(56, 189, 248, 0.5)' : (isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)'),
              color: isLight ? '#18345F' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(16px)',
              boxShadow: showNotificationsMenu ? '0 0 20px rgba(34, 211, 238, 0.4)' : (isLight ? '0 6px 20px rgba(100, 130, 200, 0.15)' : '0 6px 20px rgba(0,0,0,0.3)'),
              transition: 'all 0.25s ease'
            }}
          >
            <Bell size={18} color={showNotificationsMenu ? '#38bdf8' : (isLight ? '#18345F' : '#ffffff')} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                borderRadius: '9999px',
                background: '#f43f5e',
                border: isLight ? '2px solid #ffffff' : '2px solid #070B18',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(244, 63, 94, 0.8)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Glass Dropdown */}
          {showNotificationsMenu && (
            <div style={{
              position: 'absolute',
              top: '54px',
              right: 0,
              width: '340px',
              background: isLight 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 246, 255, 0.92) 100%)' 
                : 'linear-gradient(135deg, rgba(15, 22, 50, 0.96) 0%, rgba(9, 13, 35, 0.98) 100%)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              padding: '18px',
              boxShadow: isLight 
                ? '0 25px 65px rgba(64, 100, 160, 0.2), inset 0 1.5px 2px rgba(255, 255, 255, 1)' 
                : '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(99, 102, 241, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: isLight ? '1px solid rgba(6, 182, 212, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} color="#06b6d4" />
                  <strong style={{ color: isLight ? '#18345F' : '#ffffff', fontSize: '0.92rem', fontWeight: 800 }}>Notifications</strong>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', fontWeight: 700 }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: '#06b6d4', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Check size={13} /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {notifications && notifications.length > 0 ? (
                  notifications.map(n => {
                    const isUnread = !n.read && n.unread !== false;
                    const accentColor = n.accent || (
                      n.type === 'ai' || n.type === 'recommendation' ? '#38bdf8' :
                      n.type === 'achievement' ? '#34d399' :
                      n.type === 'exchange' ? '#a855f7' :
                      n.type === 'deadline' ? '#f59e0b' :
                      n.type === 'priority' ? '#f43f5e' : '#38bdf8'
                    );

                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '16px',
                          background: isUnread 
                            ? (isLight ? 'rgba(238, 242, 255, 0.95)' : `linear-gradient(135deg, ${accentColor}20 0%, rgba(15, 23, 42, 0.8) 100%)`) 
                            : (isLight ? 'rgba(241, 245, 249, 0.55)' : 'rgba(255, 255, 255, 0.03)'),
                          borderTop: isUnread ? `1px solid ${accentColor}40` : (isLight ? '1px solid rgba(226, 232, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.06)'),
                          borderRight: isUnread ? `1px solid ${accentColor}40` : (isLight ? '1px solid rgba(226, 232, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.06)'),
                          borderBottom: isUnread ? `1px solid ${accentColor}40` : (isLight ? '1px solid rgba(226, 232, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.06)'),
                          borderLeft: isUnread 
                            ? `5px solid ${accentColor}` 
                            : (isLight ? '5px solid rgba(203, 213, 225, 0.6)' : '5px solid rgba(148, 163, 184, 0.2)'),
                          boxShadow: isUnread ? `0 4px 20px ${accentColor}30` : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isUnread && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: accentColor,
                                boxShadow: `0 0 10px ${accentColor}`,
                                display: 'inline-block',
                                flexShrink: 0
                              }} />
                            )}
                            <strong style={{
                              color: isUnread ? (isLight ? '#0f172a' : '#ffffff') : (isLight ? '#64748b' : '#94a3b8'),
                              fontSize: '0.84rem',
                              fontWeight: isUnread ? 800 : 600
                            }}>
                              {n.title}
                            </strong>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8', opacity: isUnread ? 1 : 0.7 }}>
                            {n.timeAgo || n.time || 'Recent'}
                          </span>
                        </div>
                        <p style={{
                          color: isUnread ? (isLight ? '#334155' : '#cbd5e1') : (isLight ? '#94a3b8' : '#64748b'),
                          fontSize: '0.78rem',
                          margin: 0,
                          lineHeight: 1.4
                        }}>
                          {n.message}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.82rem' }}>
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
            color: isLight ? '#18345F' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            boxShadow: isLight ? '0 6px 20px rgba(100, 130, 200, 0.15)' : '0 6px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.25s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* User Profile Pill Widget & Glass Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              setShowProfileMenu(prev => !prev);
              setShowNotificationsMenu(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '5px 14px 5px 6px',
              borderRadius: '9999px',
              background: showProfileMenu ? (isLight ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.18)') : (isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
              border: showProfileMenu ? '1px solid rgba(56, 189, 248, 0.5)' : (isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)'),
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              boxShadow: showProfileMenu ? '0 0 20px rgba(34, 211, 238, 0.35)' : (isLight ? '0 6px 20px rgba(100, 130, 200, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.3)'),
              transition: 'all 0.25s ease'
            }}
          >
            <img
              src={userAvatar}
              alt={fullName}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #38bdf8'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <strong style={{ fontSize: '0.84rem', color: isLight ? '#18345F' : '#ffffff', lineHeight: 1.1 }}>{fullName}</strong>
              <span style={{ fontSize: '0.7rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Student</span>
            </div>
            <ChevronDown
              size={14}
              color={isLight ? '#5D7192' : '#94a3b8'}
              style={{
                marginLeft: '4px',
                transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease'
              }}
            />
          </div>

          {/* Profile Menu Glass Dropdown */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '54px',
              right: 0,
              width: '240px',
              background: isLight 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 246, 255, 0.92) 100%)' 
                : 'linear-gradient(135deg, rgba(15, 22, 50, 0.96) 0%, rgba(9, 13, 35, 0.98) 100%)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              padding: '12px',
              boxShadow: isLight 
                ? '0 25px 65px rgba(64, 100, 160, 0.2)' 
                : '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(56, 189, 248, 0.2)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ padding: '8px 10px', borderBottom: isLight ? '1px solid rgba(6, 182, 212, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                <strong style={{ color: isLight ? '#18345F' : '#ffffff', fontSize: '0.86rem', display: 'block' }}>{fullName}</strong>
                <span style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.74rem' }}>{user?.email || 'student@edunova.edu'}</span>
              </div>

              <div
                onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', color: isLight ? '#18345F' : '#e2e8f0', fontSize: '0.84rem' }}
              >
                <User size={15} color="#38bdf8" /> My Profile
              </div>

              <div
                onClick={() => { setShowProfileMenu(false); navigate('/analytics'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', color: isLight ? '#18345F' : '#e2e8f0', fontSize: '0.84rem' }}
              >
                <BarChart2 size={15} color="#10b981" /> Analytics & Radar
              </div>

              <div
                onClick={() => { setShowProfileMenu(false); navigate('/parent/dashboard'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', color: isLight ? '#18345F' : '#e2e8f0', fontSize: '0.84rem' }}
              >
                <ShieldCheck size={15} color="#a855f7" /> Parent Portal
              </div>

              <div
                onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', color: isLight ? '#18345F' : '#e2e8f0', fontSize: '0.84rem' }}
              >
                <Settings size={15} color="#f59e0b" /> Settings
              </div>

              <div
                onClick={() => { setShowProfileMenu(false); logout(); navigate('/'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', color: '#ef4444', fontSize: '0.84rem', borderTop: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)', marginTop: '4px' }}
              >
                <LogOut size={15} color="#ef4444" /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
