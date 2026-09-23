import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Sun, Moon, Search, Bell, User, LogOut, Settings, Dna, CheckCircle2, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { getDynamicAvatar } from '../../utils/avatarUtils';

export const Navbar = ({ onOpenSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
    setShowMobileMenu(false);
  };

  const activeHash = location.hash;
  const isMarketplaceActive = location.pathname === '/marketplace' || location.pathname === '/skill-marketplace';

  return (
    <header className={`liquid-glass-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <img
              src="/edunova_icon.png"
              alt="EduNova Icon"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 16px rgba(6, 182, 212, 0.95))'
              }}
            />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }} className="gradient-text-animated">
              EduNova
            </span>
          </div>
        </Link>

        {/* Navigation Links (Desktop Capsule) */}
        {!isAuthenticated && (
          <nav style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '5px 8px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }} className="desktop-only">
            {[
              { label: 'Home', path: '/' },
              { label: 'Features', hash: 'features' },
              { label: 'For Schools', hash: 'tracks' },
              { label: 'For Students', hash: 'tracks' },
              { label: 'Pricing', hash: 'pricing' },
              { label: 'About', hash: 'about' }
            ].map(tab => (
              <a
                key={tab.label}
                href={tab.hash ? `#${tab.hash}` : tab.path}
                onClick={(e) => tab.hash ? scrollToSection(e, tab.hash) : navigate(tab.path)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  background: (location.pathname === tab.path && !activeHash) || (tab.hash && activeHash === `#${tab.hash}`)
                    ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                    : 'transparent',
                  color: (location.pathname === tab.path && !activeHash) || (tab.hash && activeHash === `#${tab.hash}`) ? '#ffffff' : '#cbd5e1',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: (location.pathname === tab.path && !activeHash) || (tab.hash && activeHash === `#${tab.hash}`) ? '0 4px 14px rgba(6, 182, 212, 0.35)' : 'none'
                }}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Trigger Pill */}
          {isAuthenticated && (
            <button
              onClick={onOpenSearch}
              className="liquid-glass-search-btn"
            >
              <Search size={16} color="#38bdf8" />
              <span className="desktop-only">Search courses, AR lab, skills...</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="liquid-glass-icon-btn"
            aria-label="Toggle Dark/Light theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Authenticated Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              {/* Notification Bell Button & Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowNotificationsMenu(!showNotificationsMenu);
                    setShowProfileMenu(false);
                  }}
                  className="liquid-glass-icon-btn"
                  aria-label="Notifications"
                >
                  <Bell size={18} color="#f1f5f9" />
                  {unreadCount > 0 && (
                    <span className="liquid-glass-badge">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Glass Dropdown */}
                {showNotificationsMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '320px',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '16px',
                    boxShadow: 'var(--glass-shadow)',
                    zIndex: 990
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Notifications</strong>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
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
                                padding: '10px 12px',
                                borderRadius: '12px',
                                background: isUnread ? `linear-gradient(135deg, ${accentColor}20 0%, rgba(15, 23, 42, 0.8) 100%)` : 'rgba(255, 255, 255, 0.03)',
                                borderTop: isUnread ? `1px solid ${accentColor}40` : '1px solid rgba(255, 255, 255, 0.06)',
                                borderRight: isUnread ? `1px solid ${accentColor}40` : '1px solid rgba(255, 255, 255, 0.06)',
                                borderBottom: isUnread ? `1px solid ${accentColor}40` : '1px solid rgba(255, 255, 255, 0.06)',
                                borderLeft: isUnread ? `5px solid ${accentColor}` : '5px solid rgba(148, 163, 184, 0.2)',
                                boxShadow: isUnread ? `0 4px 18px ${accentColor}25` : 'none',
                                fontSize: '0.8rem',
                                color: isUnread ? '#ffffff' : '#94a3b8',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                {isUnread && (
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}`, display: 'inline-block' }} />
                                )}
                                <strong style={{ display: 'block', color: isUnread ? '#ffffff' : '#94a3b8', fontSize: '0.82rem', fontWeight: isUnread ? 800 : 600 }}>
                                  {n.title}
                                </strong>
                              </div>
                              <span style={{ fontSize: '0.78rem', lineHeight: 1.35, opacity: isUnread ? 1 : 0.75, display: 'block' }}>
                                {n.message}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '12px' }}>
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar Button & Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotificationsMenu(false);
                  }}
                  className="liquid-glass-avatar-btn"
                  aria-label="User profile menu"
                >
                  <img
                    src={getDynamicAvatar(user)}
                    alt={user?.name || 'User'}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #06b6d4',
                      boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
                    }}
                  />
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {/* Profile Menu Glass Dropdown */}
                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '210px',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '8px',
                    boxShadow: 'var(--glass-shadow)',
                    zIndex: 990,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                      <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.88rem' }}>{user?.name || 'Alex Mercer'}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{user?.email || 'alex@edunova.io'}</span>
                    </div>

                    <button
                      onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <User size={16} color="var(--accent-cyan)" /> My Profile
                    </button>

                    <button
                      onClick={() => { setShowProfileMenu(false); navigate('/skill-dna'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <Dna size={16} color="var(--accent-secondary)" /> Skill DNA Profile
                    </button>

                    <button
                      onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <Settings size={16} color="var(--accent-emerald)" /> Settings
                    </button>

                    <button
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await logout();
                        navigate('/', { replace: true });
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', border: 'none', color: '#fb7185', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}
                    >
                      <LogOut size={16} color="#fb7185" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }} className="desktop-only">
                <Link
                  to="/login"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)'
                  }}
                >
                  Start Learning
                </Link>
              </div>

              {/* Mobile Hamburger Menu Toggle Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="mobile-only"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Toggle mobile menu"
              >
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Public Mobile Dropdown Menu Drawer */}
      {!isAuthenticated && showMobileMenu && (
        <div style={{
          position: 'absolute',
          top: 'var(--navbar-height)',
          left: 0,
          right: 0,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          zIndex: 950
        }} className="mobile-only">
          <a
            href="#ai-vision-section"
            onClick={(e) => scrollToSection(e, 'ai-vision-section')}
            className={`nav-item-link ${activeHash === '#ai-vision-section' ? 'active' : ''}`}
            style={{ width: '100%', padding: '12px 16px' }}
          >
            AI Vision
          </a>
          <a
            href="#interactive-labs-section"
            onClick={(e) => scrollToSection(e, 'interactive-labs-section')}
            className={`nav-item-link ${activeHash === '#interactive-labs-section' ? 'active' : ''}`}
            style={{ width: '100%', padding: '12px 16px' }}
          >
            3D AR Labs
          </a>
          <Link
            to="/marketplace"
            onClick={() => setShowMobileMenu(false)}
            className={`nav-item-link ${isMarketplaceActive ? 'active' : ''}`}
            style={{ width: '100%', padding: '12px 16px' }}
          >
            Skill Marketplace
          </Link>
          <a
            href="#features-section"
            onClick={(e) => scrollToSection(e, 'features-section')}
            className={`nav-item-link ${activeHash === '#features-section' ? 'active' : ''}`}
            style={{ width: '100%', padding: '12px 16px' }}
          >
            Features
          </a>
          <a
            href="#faq-section"
            onClick={(e) => scrollToSection(e, 'faq-section')}
            className={`nav-item-link ${activeHash === '#faq-section' ? 'active' : ''}`}
            style={{ width: '100%', padding: '12px 16px' }}
          >
            FAQ
          </a>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', gap: '10px' }}>
            <Link
              to="/login"
              onClick={() => setShowMobileMenu(false)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                background: 'var(--bg-tertiary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => setShowMobileMenu(false)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              Start Learning
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
