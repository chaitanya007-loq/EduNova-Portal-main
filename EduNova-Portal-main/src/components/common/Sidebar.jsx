import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  FileText,
  GraduationCap,
  Sparkles,
  Glasses,
  Network,
  Repeat,
  LayoutGrid,
  FlaskConical,
  TrendingUp,
  Award,
  Users,
  User,
  Settings,
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  Gamepad2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Sidebar = () => {
  const { isParent, user } = useAuth();
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isParentMode = isParent || location.pathname.startsWith('/parent');
  const isAdmin = user?.role === 'ADMIN';

  const navItems = isAdmin
    ? [
        { label: 'Admin Workspace', path: '/admin', icon: ShieldCheck }
      ]
    : isParentMode
    ? [
        { label: 'Parent Dashboard', path: '/parent/dashboard', icon: Home },
        { label: 'Child Performance', path: '/analytics', icon: TrendingUp },
        { label: 'Parent Sage AI', path: '/ai-assistant', icon: Sparkles },
        { label: 'Study Planner', path: '/study-planner', icon: LayoutGrid },
        { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Game Center', path: '/games', icon: Gamepad2 },
        { label: 'Explore Curriculum', path: '/courses', icon: GraduationCap },
        { label: 'Child Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings }
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: Home },
        { label: 'My Subjects', path: '/my-subjects', icon: BookOpen },
        { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Game Center', path: '/games', icon: Gamepad2 },
        { label: 'Smart Notes', path: '/notes', icon: FileText },
        { label: 'Explore Curriculum', path: '/courses', icon: GraduationCap },
        { label: 'Sage AI Tutor', path: '/ai-assistant', icon: Sparkles },
        { label: 'EduNova XR Studio', path: '/xr-studio', icon: Glasses },
        { label: 'Knowledge Constellation', path: '/constellation', icon: Network },
        { label: 'Peer Skill Exchange', path: '/skill-exchange', icon: Repeat },
        { label: 'Study Planner', path: '/study-planner', icon: LayoutGrid },
        { label: 'Immersive Learning Lab', path: '/labs', icon: FlaskConical },
        { label: 'Progress Analytics', path: '/analytics', icon: TrendingUp },
        { label: 'Achievements', path: '/achievements', icon: Award },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings }
      ];

  const sidebarWidth = isCollapsed ? '76px' : '260px';

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        flexShrink: 0,
        height: 'calc(100vh - 32px)',
        margin: '16px 0 16px 16px',
        position: 'relative',
        background: isLight
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
          : 'linear-gradient(180deg, rgba(25, 35, 75, 0.75) 0%, rgba(15, 20, 48, 0.88) 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '28px',
        display: 'flex',
        flexDirection: 'column',
        padding: isCollapsed ? '20px 8px' : '24px 16px',
        gap: '4px',
        overflow: 'hidden',
        overflowX: 'hidden',
        boxShadow: isLight
          ? '0 20px 60px rgba(64, 100, 160, 0.14), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
          : '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50
      }}
      className="desktop-only"
    >
      {/* Sticky Fixed Header Container */}
      <div style={{ flexShrink: 0, paddingBottom: '4px' }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 14px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: isLight
              ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(124, 58, 237, 0.25))'
              : 'linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(139, 92, 246, 0.35))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)'
          }}>
            <img
              src="/edunova_icon.png"
              alt="EduNova Logo"
              style={{ width: '30px', height: '30px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(54, 199, 244, 0.8))' }}
            />
          </div>
          {!isCollapsed && (
            <div>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: isLight ? '#0f172a' : '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-heading)'
              }}>
                EduNova
              </h2>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, display: 'block', marginTop: '1px' }}>
                Learn Beyond Boundaries
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: isLight ? '#0f172a' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* NAVIGATION SECTION HEADER */}
      {!isCollapsed && (
        <div style={{
          padding: '10px 8px 6px 8px',
          fontSize: '0.68rem',
          fontWeight: 800,
          color: isLight ? '#0284c7' : '#64748b',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          Navigation
        </div>
      )}
      </div>

      {/* Navigation Links List (Scrollable Area) */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '2px'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = location.pathname === item.path ||
            (item.path === '/parent/dashboard' && (location.pathname === '/parent-dashboard' || location.pathname.startsWith('/parent')));
          return (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              title={item.label}
              style={({ isActive }) => {
                const active = isActive || isItemActive;
                return {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: '12px',
                  padding: isCollapsed ? '10px 0' : '10px 14px',
                  borderRadius: '16px',
                  fontSize: '0.86rem',
                  fontWeight: active ? 800 : 700,
                  color: active ? '#ffffff' : (isLight ? '#0f172a' : '#94a3b8'),
                  background: active
                    ? (isLight
                        ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%)'
                        : 'linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)')
                    : 'transparent',
                  boxShadow: active
                    ? (isLight ? '0 8px 25px rgba(2, 132, 199, 0.4), inset 0 1px 1.5px rgba(255, 255, 255, 0.4)' : '0 8px 25px rgba(79, 140, 255, 0.35)')
                    : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  textDecoration: 'none'
                };
              }}
            >
              {({ isActive }) => {
                const active = isActive || isItemActive;
                return (
                  <>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '10px',
                      background: active ? 'rgba(255, 255, 255, 0.22)' : (isLight ? 'rgba(2, 132, 199, 0.1)' : 'transparent'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={16} color={active ? '#ffffff' : (isLight ? '#0284c7' : '#94a3b8')} style={{ flexShrink: 0 }} />
                    </div>
                    {!isCollapsed && (
                      <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: active ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'),
                        fontWeight: active ? 800 : 700
                      }}>
                        {item.label}
                      </span>
                    )}
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Promo Card */}
      {!isCollapsed && (
        <div
          style={{
            marginTop: 'auto',
            padding: '12px 14px',
            borderRadius: '18px',
            background: isLight ? 'rgba(255, 255, 255, 0.70)' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: isLight ? '0 8px 20px rgba(64, 100, 160, 0.08)' : '0 8px 20px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(139, 108, 255, 0.2), rgba(54, 199, 244, 0.2))',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C12 3 8 7 8 11C8 13.2 9.8 15 12 15C14.2 15 16 13.2 16 11C16 7 12 3 12 3Z" fill="#36C7F4" />
                <path d="M12 15V21" stroke="#4F8CFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 16C5 14 5 11 5 11C5 11 8 11 10 13" fill="#8B6CFF" />
                <path d="M17 16C19 14 19 11 19 11C19 11 16 11 14 13" fill="#8B6CFF" />
              </svg>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.8rem', color: isLight ? '#18345F' : '#ffffff', lineHeight: 1.2 }}>Keep Learning</strong>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Keep Growing</span>
            </div>
          </div>
          <ChevronRight size={16} color={isLight ? '#18345F' : '#ffffff'} />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
