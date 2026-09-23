import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import videoBg from '../../Video/EduNova(V).mp4';
import {
  Sparkles,
  Bot,
  Glasses,
  Repeat,
  ArrowRight,
  Globe,
  Dna,
  ChevronDown,
  Star,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  GraduationCap,
  Target,
  BookOpen,
  Calendar,
  Search,
  Video,
  BookMarked,
  BarChart3,
  Home,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Award,
  Book,
  Laptop,
  ChevronLeft,
  ChevronRight,
  X,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Navigation & Scroll state
  const [activeNav, setActiveNav] = useState('Home'); // 'Home' | 'Features' | 'For Schools' | 'For Students' | 'Pricing' | 'About'
  const [isScrolled, setIsScrolled] = useState(false);

  // Interactive Live Demo Modals & Video Background state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTrackTab, setActiveTrackTab] = useState('school');
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [selectedFeatureModal, setSelectedFeatureModal] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 30;
          setIsScrolled(prev => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const scrollToSection = (id, navName) => {
    setActiveNav(navName);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: 'How does Sage AI Tutor personalize learning for each student?',
      a: 'Sage AI continuously analyzes your diagnostic quiz scores, topic solving speed, and weak area telemetry. It automatically schedules targeted practice sessions, generates diagnostic quizzes, and provides step-by-step explanations tailored to your learning style.'
    },
    {
      q: 'What are the 4 custom learning tracks in EduNova?',
      a: 'EduNova offers specialized curriculum hubs for School (Class 10 CBSE Board prep), College (B.Tech engineering & computer science), Exam Prep (CMAT 2026 speed & accuracy radar), and Skills & Career (Full-Stack engineering, React, Node, and PostgreSQL system design).'
    },
    {
      q: 'Do I need special hardware to use the 3D WebXR Studio?',
      a: 'No! EduNova WebXR runs directly in any modern browser (Chrome, Edge, Safari) using WebGL hit-testing and touch/mouse controls. If you own an AR/VR headset, you can also enter full spatial 3D mode.'
    },
    {
      q: 'How does the Peer Skill Swap & Barter Marketplace work?',
      a: 'Students can exchange technical skills directly without money. For example, teach React or Physics in exchange for learning Calculus or UI Design, earning verified XP tokens for peer learning sessions.'
    },
    {
      q: 'Can parents monitor student progress securely?',
      a: 'Yes! Students can generate a secure Parent Companion invite code. Parents receive a dedicated dashboard showing daily study time, streak counters, and subject progress without compromising private student AI tutor chats.'
    }
  ];

  return (
    <div
      className="edunova-landing-page"
      data-theme="dark"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #151c3a 0%, #080c1e 60%, #050714 100%)',
        color: '#ffffff',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      
      {/* ------------------------------------------------------------- */}
      {/* SEAMLESS FULL-PAGE BACKGROUND VIDEO LAYER                      */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%) translateZ(0)',
        width: '100vw',
        height: '1200px',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform'
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.42,
            filter: 'brightness(0.85) contrast(1.1) saturate(1.15)',
            transform: 'translateZ(0)'
          }}
        >
          <source src={videoBg} type="video/mp4" />
          <source src="/Video/EduNova(V).mp4" type="video/mp4" />
        </video>

        {/* Continuous Ultra-Smooth Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(21, 28, 58, 0.35) 0%, rgba(15, 23, 42, 0.65) 45%, rgba(8, 12, 30, 0.88) 75%, #080c1e 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ATMOSPHERIC BACKGROUND GLOW ORBS & FLOATING 3D GLASS BUBBLES  */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%) translateZ(0)',
        width: '1200px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(139, 92, 246, 0.12) 40%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform'
      }} />

      <div style={{
        position: 'absolute',
        top: '25%',
        right: '-5%',
        transform: 'translateZ(0)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(56, 189, 248, 0.1) 50%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform'
      }} />

      <div style={{
        position: 'absolute',
        top: '55%',
        left: '-5%',
        transform: 'translateZ(0)',
        width: '750px',
        height: '750px',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.14) 0%, rgba(56, 189, 248, 0.1) 50%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '-5%',
        transform: 'translateZ(0)',
        width: '850px',
        height: '850px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(244, 63, 94, 0.08) 50%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform'
      }} />

      {/* Decorative Animated 3D Glass Orbs (Hardware Accelerated) */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '680px',
          left: '-40px',
          width: '190px',
          height: '190px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(147, 197, 253, 0.65) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(15, 23, 42, 0.85) 100%)',
          boxShadow: 'inset -10px -10px 25px rgba(0,0,0,0.6), inset 10px 10px 25px rgba(255,255,255,0.45), 0 25px 50px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.85,
          willChange: 'transform'
        }}
      />

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          top: '780px',
          left: '90px',
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(192, 132, 252, 0.65) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(15, 23, 42, 0.85) 100%)',
          boxShadow: 'inset -6px -6px 18px rgba(0,0,0,0.6), inset 6px 6px 18px rgba(255,255,255,0.45), 0 18px 36px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.8,
          willChange: 'transform'
        }}
      />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 0.5 }}
        style={{
          position: 'absolute',
          top: '1400px',
          right: '-50px',
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(167, 243, 208, 0.6) 0%, rgba(16, 185, 129, 0.25) 50%, rgba(15, 23, 42, 0.85) 100%)',
          boxShadow: 'inset -10px -10px 25px rgba(0,0,0,0.6), inset 10px 10px 25px rgba(255,255,255,0.45), 0 25px 50px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.75,
          willChange: 'transform'
        }}
      />

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 7.5, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute',
          top: '2200px',
          left: '-30px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(253, 164, 175, 0.6) 0%, rgba(244, 63, 94, 0.25) 50%, rgba(15, 23, 42, 0.85) 100%)',
          boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.6), inset 8px 8px 20px rgba(255,255,255,0.45), 0 20px 40px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.75,
          willChange: 'transform'
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION BAR WITH FLOATING FROSTED GLASS PILL NAV   */}
      {/* ------------------------------------------------------------- */}
      <header style={{
        position: 'fixed',
        top: isScrolled ? '12px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '1280px',
        zIndex: 1000,
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isScrolled ? '8px 18px' : '10px 20px',
          borderRadius: '9999px',
          background: isScrolled
            ? 'rgba(10, 15, 30, 0.84)'
            : 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: isScrolled
            ? '1px solid rgba(56, 189, 248, 0.35)'
            : '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: isScrolled
            ? '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(56, 189, 248, 0.2), inset 0 1px 1.5px rgba(255, 255, 255, 0.3)'
            : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.25)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          
          {/* Left Brand Logo (3D Translucent Cube) */}
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          >
            <div style={{
              width: isScrolled ? '38px' : '42px',
              height: isScrolled ? '38px' : '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35), rgba(168, 85, 247, 0.35))',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(56, 189, 248, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease'
            }}>
              <img
                src="/edunova_icon.png"
                alt="EduNova Logo"
                style={{ width: isScrolled ? '24px' : '28px', height: isScrolled ? '24px' : '28px', objectFit: 'contain', transition: 'all 0.3s ease' }}
              />
            </div>
            <div>
              <h1 style={{
                fontSize: isScrolled ? '1.15rem' : '1.25rem',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                transition: 'font-size 0.3s ease'
              }}>
                EduNova
              </h1>
              <span style={{
                fontSize: '0.66rem',
                color: '#94a3b8',
                display: 'block',
                marginTop: '1px',
                fontWeight: 500,
                letterSpacing: '0.01em'
              }}>
                Learn Beyond Boundaries
              </span>
            </div>
          </div>

          {/* Center Floating Glass Pill Nav */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 6px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Features', id: 'features' },
              { label: 'Learning Tracks', id: 'tracks' },
              { label: '3D Spatial Labs', id: 'spatial-labs', route: '/xr-studio' },
              { label: 'FAQ', id: 'faq' },
              { label: 'About', id: 'about' }
            ].map(tab => {
              const isActive = activeNav === tab.label;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    if (tab.route && isAuthenticated) {
                      navigate(tab.route);
                    } else if (tab.id) {
                      scrollToSection(tab.id, tab.label);
                    } else if (tab.route) {
                      navigate('/login');
                    }
                  }}
                  style={{
                    padding: isScrolled ? '7px 16px' : '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.38) 0%, rgba(99, 102, 241, 0.38) 100%)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.65)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.4), inset 0 1px 1px rgba(255,255,255,0.35)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '8px 14px'
              }}
            >
              Login
            </button>

            <button
              onClick={() => navigate('/register')}
              style={{
                padding: isScrolled ? '9px 22px' : '11px 24px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 50%, #d946ef 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              Get Started <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN HERO SECTION (SEAMLESS FULL-PAGE BACKGROUND INTEGRATION) */}
      {/* ------------------------------------------------------------- */}
      <section id="hero" style={{
        position: 'relative',
        minHeight: '820px',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '120px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Hero Content Overlay Layer */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          height: '100%',
          alignItems: 'center',
          paddingTop: '30px'
        }}>
          
          {/* HERO LEFT CONTENT (Columns 1-6) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ gridColumn: 'span 6', paddingRight: '20px' }}
          >
            {/* AI Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: '28px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
            }}>
              <Sparkles size={15} color="#38bdf8" /> AI-Powered Learning Platform
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: '3.9rem',
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: '-0.035em',
              margin: '0 0 22px 0',
              color: '#ffffff',
              dropShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              Personalized Learning <br />
              <span style={{ fontWeight: 900, color: '#ffffff' }}>for a </span>
              <span style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 20%, #c084fc 40%, #e879f9 60%, #f43f5e 80%, #38bdf8 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                animation: 'gradientShift 6s ease infinite'
              }}>
                Brighter Future
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p style={{
              fontSize: '1.08rem',
              color: '#cbd5e1',
              lineHeight: 1.65,
              marginBottom: '36px',
              maxWidth: '510px',
              fontWeight: 400,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)'
            }}>
              EduNova combines AI, interactive learning, and modern tools to help students learn smarter, build skills and achieve their dreams — anytime, anywhere.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '50px' }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '12px 28px 12px 14px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 30px rgba(56, 189, 248, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  <ArrowRight size={16} />
                </div>
                Start Learning Free
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                style={{
                  padding: '12px 24px 12px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <Play size={14} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
                </div>
                Watch Video
              </button>
            </div>

            {/* Horizontal Glass Stats Bar (Bottom Left Overlay) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.62)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              padding: '18px 24px',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.25)',
              maxWidth: '560px'
            }}>
              <div style={{ paddingRight: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={15} color="#38bdf8" />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#ffffff' }}>10K+</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '4px', fontWeight: 500 }}>Active Learners</span>
              </div>

              <div style={{ paddingRight: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(165, 180, 252, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={15} color="#a5b4fc" />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#ffffff' }}>500+</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '4px', fontWeight: 500 }}>Expert Courses</span>
              </div>

              <div style={{ paddingRight: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={15} color="#fbbf24" />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#ffffff' }}>98%</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '4px', fontWeight: 500 }}>Satisfaction Rate</span>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={15} color="#34d399" />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#ffffff' }}>50+</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginTop: '4px', fontWeight: 500 }}>Countries</span>
              </div>
            </div>
          </motion.div>

          {/* HERO RIGHT CLEAN VIDEO AREA (Columns 7-12) */}
          <div style={{ gridColumn: 'span 6', position: 'relative', height: '540px' }} />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. PLATFORM FEATURES 3D COVER-FLOW CAROUSEL SECTION          */}
      {/* ------------------------------------------------------------- */}
      <section id="features" style={{ padding: '90px 24px', maxWidth: '1380px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '6px 18px', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            ✦ Unified Learning Ecosystem
          </span>
          <h2 style={{ fontSize: '2.7rem', fontWeight: 900, margin: '16px 0 12px 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Built with Powerful Modern Features
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Explore EduNova's suite of AI diagnostics, spatial WebXR labs, 3D skill maps, and peer swap tools in an interactive 3D view.
          </p>
        </div>

        {/* 3D Cover Flow Stage Container */}
        <div style={{ position: 'relative', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px', overflow: 'hidden', padding: '20px 0' }}>
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveFeatureIndex((prev) => (prev - 1 + 7) % 7)}
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 35,
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
              transition: 'all 0.25s ease'
            }}
          >
            <ChevronLeft size={24} color="#38bdf8" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveFeatureIndex((prev) => (prev + 1) % 7)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 35,
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
              transition: 'all 0.25s ease'
            }}
          >
            <ChevronRight size={24} color="#38bdf8" />
          </button>

          {/* 3D Cards Stack */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            height: '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d'
          }}>
            {[
              {
                icon: Bot,
                title: 'Sage AI Tutor & Diagnostics',
                desc: 'Instant AI doubt resolution, automated 10-question diagnostic quiz generator, weak topic detection, and personalized study recommendations.',
                color: '#38bdf8',
                badge: 'AI Engine'
              },
              {
                icon: GraduationCap,
                title: '4 Custom Learning Tracks',
                desc: 'Tailored curriculum command centers for School (Class 10 CBSE), College (B.Tech Sem 5), Exam Prep (CMAT 2026), and Skills & Career (Full Stack).',
                color: '#a5b4fc',
                badge: 'Curriculum Hub'
              },
              {
                icon: Glasses,
                title: 'EduNova 3D XR Studio & Labs',
                desc: 'WebGL interactive 3D spatial models for geometry, physics ray optics, chemistry molecular bonding, and circuit simulators.',
                color: '#34d399',
                badge: '3D Spatial'
              },
              {
                icon: Dna,
                title: 'Knowledge Constellation Map',
                desc: 'Interactive 3D node graph visualizing subject prerequisites, topic dependency webs, and skill mastery milestones.',
                color: '#f59e0b',
                badge: 'Skill Trees'
              },
              {
                icon: Repeat,
                title: 'Peer Skill Swap Marketplace',
                desc: 'Exchange technical knowledge directly with peers without money. Teach React or Physics to learn Calculus while earning XP rewards.',
                color: '#fb7185',
                badge: 'Peer Network'
              },
              {
                icon: BarChart3,
                title: 'Telemetry & Parent Companion',
                desc: 'Real-time study time analytics, daily streak counters, XP level progression, and safe parent monitoring portal.',
                color: '#c084fc',
                badge: 'Analytics'
              },
              {
                icon: BookOpen,
                title: 'Smart Notes & Knowledge Hub',
                desc: 'Rich AI note generator, instant assessment builder, 3D flippable flashcard deck, subject linking, and Sage note export.',
                color: '#38bdf8',
                badge: 'Smart Notes'
              }
            ].map((feat, idx) => {
              const IconComp = feat.icon;

              // Compute relative offset distance from active index
              const total = 7;
              let offset = idx - activeFeatureIndex;
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              const isActive = offset === 0;

              // Transform calculations based on 3D perspective offset
              let transformStr = '';
              let zIndexVal = 1;
              let opacityVal = 0;

              if (offset === 0) {
                transformStr = 'translateX(0px) scale(1.06) rotateY(0deg) translateZ(0px)';
                zIndexVal = 20;
                opacityVal = 1;
              } else if (offset === -1) {
                transformStr = 'translateX(-315px) scale(0.85) rotateY(20deg) translateZ(-70px)';
                zIndexVal = 10;
                opacityVal = 0.78;
              } else if (offset === 1) {
                transformStr = 'translateX(315px) scale(0.85) rotateY(-20deg) translateZ(-70px)';
                zIndexVal = 10;
                opacityVal = 0.78;
              } else if (offset === -2) {
                transformStr = 'translateX(-540px) scale(0.7) rotateY(32deg) translateZ(-150px)';
                zIndexVal = 5;
                opacityVal = 0.42;
              } else if (offset === 2) {
                transformStr = 'translateX(540px) scale(0.7) rotateY(-32deg) translateZ(-150px)';
                zIndexVal = 5;
                opacityVal = 0.42;
              } else {
                transformStr = 'translateX(0px) scale(0.5) translateZ(-300px)';
                zIndexVal = 1;
                opacityVal = 0;
              }

              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveFeatureIndex(idx)}
                  animate={{
                    transform: transformStr,
                    opacity: opacityVal,
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    width: '340px',
                    height: '390px',
                    borderRadius: '28px',
                    background: isActive
                      ? `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(20, 32, 65, 0.5) 100%)`
                      : `linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(15, 23, 42, 0.6) 100%)`,
                    backdropFilter: 'blur(36px) saturate(200%) contrast(105%)',
                    WebkitBackdropFilter: 'blur(36px) saturate(200%) contrast(105%)',
                    border: isActive
                      ? '1.5px solid rgba(255, 255, 255, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: isActive
                      ? `0 30px 80px rgba(0, 0, 0, 0.65), 0 0 50px ${feat.color}45, inset 0 1.5px 2px rgba(255, 255, 255, 0.6)`
                      : '0 15px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1.5px rgba(255, 255, 255, 0.25)',
                    padding: '30px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    zIndex: zIndexVal,
                    filter: isActive ? 'none' : 'brightness(0.85)',
                    willChange: 'transform, opacity',
                    transformStyle: 'preserve-3d',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle Ambient Radial Glow Light inside Active Glass Card */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '-40px',
                      right: '-40px',
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${feat.color}40 0%, transparent 70%)`,
                      pointerEvents: 'none',
                      zIndex: 0
                    }} />
                  )}

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Top Icon & Badge Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 100%)`,
                        border: `1.5px solid rgba(255, 255, 255, 0.3)`,
                        backdropFilter: 'blur(12px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 25px ${feat.color}45, inset 0 1px 1px rgba(255,255,255,0.4)`
                      }}>
                        <IconComp size={24} color={feat.color} />
                      </div>
                      <span style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: feat.color,
                        background: 'rgba(255, 255, 255, 0.09)',
                        backdropFilter: 'blur(10px)',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: `1px solid rgba(255, 255, 255, 0.2)`
                      }}>
                        {feat.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.34rem', fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
                      {feat.title}
                    </h3>

                    <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                      {feat.desc}
                    </p>
                  </div>

                  {/* Explore Button Pill */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeatureModal(feat);
                      }}
                      style={{
                        width: '100%',
                        padding: '11px',
                        borderRadius: '9999px',
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.28) 0%, rgba(168, 85, 247, 0.28) 100%)'
                          : 'rgba(255, 255, 255, 0.08)',
                        border: isActive
                          ? '1.5px solid rgba(255, 255, 255, 0.35)'
                          : '1px solid rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                        transition: 'all 0.25s ease',
                        backdropFilter: 'blur(12px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.45) 0%, rgba(168, 85, 247, 0.45) 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.background = isActive
                          ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.28) 0%, rgba(168, 85, 247, 0.28) 100%)'
                          : 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      Explore Feature <ArrowRight size={15} color="#ffffff" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '36px' }}>
          {[0, 1, 2, 3, 4, 5, 6].map(idx => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveFeatureIndex(idx)}
              style={{
                width: activeFeatureIndex === idx ? '32px' : '10px',
                height: '10px',
                borderRadius: '9999px',
                background: activeFeatureIndex === idx
                  ? 'linear-gradient(90deg, #38bdf8 0%, #8b5cf6 100%)'
                  : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeFeatureIndex === idx ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3.5 3D SPATIAL WEBXR LABS SHOWCASE SECTION                    */}
      {/* ------------------------------------------------------------- */}
      <section id="spatial-labs" style={{ padding: '80px 24px', maxWidth: '1380px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#34d399',
            background: 'rgba(52, 211, 153, 0.12)',
            padding: '6px 18px',
            borderRadius: '9999px',
            border: '1px solid rgba(52, 211, 153, 0.3)'
          }}>
            ✦ SPATIAL WEBXR STUDIO & SIMULATIONS
          </span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, margin: '14px 0 10px 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Immersive 3D Spatial Science & Engineering Labs
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Interact with WebGL physics ray optics, 3D molecular bonding, anatomical body models, and electrical circuits directly inside your browser — zero VR headset required.
          </p>
        </div>

        {/* Grid of 4 Interactive 3D Lab Simulation Preview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {[
            {
              title: 'Virtual Optics & Ray Tracing',
              desc: 'Laser refraction, double slit quantum interference, convex mirrors, and focal length ray manipulation.',
              category: 'Physics XR',
              color: '#38bdf8',
              icon: Glasses
            },
            {
              title: '3D Chemical Molecular Builder',
              desc: 'Atomic valence shell interactions, covalent electron bonding, and 3D molecular geometry rotation.',
              category: 'Chemistry XR',
              color: '#a855f7',
              icon: Dna
            },
            {
              title: 'Human Heart 3D Anatomy',
              desc: 'Real-time cardiovascular atrium-ventricle pulse simulation with oxygenated blood flow telemetry.',
              category: 'Biology XR',
              color: '#fb7185',
              icon: GraduationCap
            },
            {
              title: 'Harmonic Oscillation & Pendulum',
              desc: 'Damped spring oscillations, gravity acceleration vectors, and real-time kinetic energy charts.',
              category: 'Mechanics XR',
              color: '#34d399',
              icon: Sparkles
            }
          ].map((lab, i) => {
            const IconC = lab.icon;
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(28px) saturate(190%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '24px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.45)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${lab.color}35 0%, rgba(255,255,255,0.05) 100%)`,
                      border: `1.5px solid ${lab.color}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconC size={22} color={lab.color} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 12px', borderRadius: '9999px', background: `${lab.color}18`, color: lab.color, border: `1px solid ${lab.color}40` }}>
                      {lab.category}
                    </span>
                  </div>
                  <h3 style={{ color: '#ffffff', fontSize: '1.18rem', fontWeight: 800, marginBottom: '10px', lineHeight: 1.3 }}>
                    {lab.title}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
                    {lab.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/xr-studio');
                    } else {
                      navigate('/login');
                    }
                  }}
                  style={{
                    marginTop: '22px',
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Launch Lab Simulation <ArrowRight size={14} color="#38bdf8" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Big Central CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(15, 23, 42, 0.8) 100%)',
          backdropFilter: 'blur(32px)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '32px',
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 25px 60px rgba(56, 189, 248, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.4)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0' }}>
              Ready to Enter 3D WebXR Studio?
            </h3>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.96rem' }}>
              Access all 20+ physics, chemistry, biology, and electronics 3D spatial simulations.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/xr-studio');
                } else {
                  navigate('/login');
                }
              }}
              style={{
                padding: '13px 28px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
              }}
            >
              Open 3D XR Studio Now <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              style={{
                padding: '13px 24px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Play size={15} fill="#ffffff" color="#ffffff" /> Watch 3D Demo
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. INTERACTIVE TRACK DEMO PREVIEW                              */}
      {/* ------------------------------------------------------------- */}
      <section id="tracks" style={{ padding: '60px 24px', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(32px) saturate(190%)',
          WebkitBackdropFilter: 'blur(32px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '36px',
          padding: '40px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '18px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                ✦ Interactive Track Preview
              </span>
              <h3 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', margin: '6px 0 0 0', letterSpacing: '-0.02em' }}>
                Tailored Dashboards for Every Learner
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'school', label: '🏫 School Track' },
                { id: 'college', label: '🎓 College Track' },
                { id: 'exam', label: '📝 Exam Prep Track' },
                { id: 'skills', label: '💻 Skills Track' },
                { id: 'parent', label: '🛡️ Parent Companion' },
                { id: 'labs', label: '🔬 3D WebXR Labs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrackTab(tab.id)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    background: activeTrackTab === tab.id
                      ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: activeTrackTab === tab.id ? '#ffffff' : '#cbd5e1',
                    border: activeTrackTab === tab.id ? '1px solid rgba(56, 189, 248, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    boxShadow: activeTrackTab === tab.id ? '0 0 25px rgba(56, 189, 248, 0.35), inset 0 1px 1px rgba(255,255,255,0.4)' : 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rich Interactive Track Content Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '28px',
            padding: '36px',
            boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.2)'
          }}>
            {activeTrackTab === 'school' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GraduationCap size={26} color="#38bdf8" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.45rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>Class 10 CBSE Board Command Center</h4>
                      <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>Curriculum & Board Mastery Engine</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['📐 Mathematics', '⚡ Physics', '🧪 Chemistry', '🧬 Biology', '📖 English', '🤖 Sage AI Tutor'].map(b => (
                      <span key={b} style={{ fontSize: '0.76rem', fontWeight: 700, padding: '5px 12px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.12)', color: '#e0f2fe', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.65 }}>
                  Master Class 10 CBSE board concepts with automated diagnostic quizzes, 3D WebXR physics labs, step-by-step Sage AI problem solving, and Parent Companion telemetry.
                </p>

                {/* 4 Feature Capabilities Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { title: 'Sage AI Diagnostics', desc: '10-question diagnostic quiz generator targeting weak topics.', icon: Zap, color: '#38bdf8' },
                    { title: '3D Physics Ray Optics', desc: 'Manipulate WebGL lenses, refraction, and focal lengths.', icon: Glasses, color: '#34d399' },
                    { title: '98.5% Board Target Radar', desc: 'Real-time subject mastery breakdown across 5 board subjects.', icon: BarChart3, color: '#a855f7' },
                    { title: 'Parent Revision Sync', desc: 'Safe student-parent streak monitoring & daily activity stats.', icon: ShieldCheck, color: '#f59e0b' }
                  ].map((feat, i) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', backdropFilter: 'blur(16px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <FIcon size={18} color={feat.color} />
                          <strong style={{ fontSize: '0.94rem', color: '#ffffff' }}>{feat.title}</strong>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Key Metric Bar & CTAs */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                    <span>📊 24 Diagnostic Mocks</span>
                    <span>🧪 15+ WebXR Models</span>
                    <span>🤖 24/7 Sage AI Tutor</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/register')}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
                      }}
                    >
                      Try School Track Free <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTrackTab === 'college' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(165, 180, 252, 0.2)', border: '1px solid rgba(165, 180, 252, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Laptop size={26} color="#a5b4fc" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.45rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>B.Tech Engineering & Computer Science Hub</h4>
                      <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 700 }}>Semester SGPA & Technical Mastery</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['💻 Data Structures', '🗄️ Database Systems', '⚙️ Operating Systems', '🌐 Computer Networks', '🔄 Peer Skill Swap'].map(b => (
                      <span key={b} style={{ fontSize: '0.76rem', fontWeight: 700, padding: '5px 12px', borderRadius: '9999px', background: 'rgba(165, 180, 252, 0.12)', color: '#e0e7ff', border: '1px solid rgba(165, 180, 252, 0.3)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.65 }}>
                  Excel in core Computer Science engineering semesters with 3D topic constellation graphs, automated code debugging, peer mentorship skill barter, and SGPA target tracking.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { title: 'Code Review & Debugger', desc: 'Sage AI reviews C++, Java, Python algorithms & SQL queries.', icon: Zap, color: '#a5b4fc' },
                    { title: '3D Constellation Tree', desc: 'Node graph visualizing prerequisite topic dependencies.', icon: Dna, color: '#38bdf8' },
                    { title: 'Target SGPA 9.5 Radar', desc: 'Semester credit tracking with subject weightage calculators.', icon: BarChart3, color: '#34d399' },
                    { title: 'Peer Skill Exchange', desc: 'Barter skills directly with peers (e.g. React for Calculus).', icon: Repeat, color: '#f59e0b' }
                  ].map((feat, i) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', backdropFilter: 'blur(16px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <FIcon size={18} color={feat.color} />
                          <strong style={{ fontSize: '0.94rem', color: '#ffffff' }}>{feat.title}</strong>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                    <span>💻 18 Core CS Modules</span>
                    <span>⚡ 120+ Code Problems</span>
                    <span>🔄 Peer Mentorship Swaps</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/register')}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
                      }}
                    >
                      Try College Track Free <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTrackTab === 'exam' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Target size={26} color="#fbbf24" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.45rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>CMAT & Entrance Speed & Accuracy Radar</h4>
                      <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>Timed Speed & Accuracy Optimizer</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['📊 Quantitative Aptitude', '🧠 Logical Reasoning', '🗣️ Verbal Ability', '💡 Innovation & GK', '⏱️ Speed Drills'].map(b => (
                      <span key={b} style={{ fontSize: '0.76rem', fontWeight: 700, padding: '5px 12px', borderRadius: '9999px', background: 'rgba(251, 191, 36, 0.12)', color: '#fef3c7', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.65 }}>
                  Accelerate your entrance exam test velocity with high-speed 60-second sprints, adaptive difficulty questions, topic bottleneck analytics, and national peer leaderboard rankings.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { title: 'Rapid Fire Speed Sprint', desc: '60-second high-intensity question sprints with multiplier bonuses.', icon: Zap, color: '#fbbf24' },
                    { title: 'Accuracy Bottleneck Radar', desc: 'Identifies specific speed traps and calculation bottlenecks.', icon: BarChart3, color: '#38bdf8' },
                    { title: 'Adaptive Question Difficulty', desc: 'Questions scale dynamically as your solving accuracy increases.', icon: Target, color: '#34d399' },
                    { title: 'Live Peer Speed Board', desc: 'Compete in weekly timed speed drills against nation-wide peers.', icon: Award, color: '#a855f7' }
                  ].map((feat, i) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', backdropFilter: 'blur(16px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <FIcon size={18} color={feat.color} />
                          <strong style={{ fontSize: '0.94rem', color: '#ffffff' }}>{feat.title}</strong>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                    <span>⏱️ 50+ Speed Drills</span>
                    <span>📝 2,000+ Exam Questions</span>
                    <span>⚡ AI Score Estimator</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/register')}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)'
                      }}
                    >
                      Try Exam Prep Track Free <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTrackTab === 'skills' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(251, 113, 133, 0.2)', border: '1px solid rgba(251, 113, 133, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dna size={26} color="#fb7185" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.45rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>Full Stack & Skill DNA Career Hub</h4>
                      <span style={{ fontSize: '0.8rem', color: '#fb7185', fontWeight: 700 }}>Industry-Ready Tech & Systems Architecture</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['⚛️ React 18', '🟢 Node.js', '🐘 PostgreSQL', '☁️ Cloud DevOps', '📜 Skill DNA Badge'].map(b => (
                      <span key={b} style={{ fontSize: '0.76rem', fontWeight: 700, padding: '5px 12px', borderRadius: '9999px', background: 'rgba(251, 113, 133, 0.12)', color: '#ffe4e6', border: '1px solid rgba(251, 113, 133, 0.3)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.65 }}>
                  Build production-grade full stack applications with React 18, Node.js microservices, PostgreSQL system design, live code flaw debugging, and verified Skill DNA badges.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { title: 'System Design Architecture', desc: 'Build scalable distributed backends and microservice patterns.', icon: Zap, color: '#fb7185' },
                    { title: 'Live Code Debugger', desc: 'Spot flaw patterns in broken code snippets with instant AI feedback.', icon: CheckCircle2, color: '#38bdf8' },
                    { title: 'Peer Mentorship Barter', desc: 'Swap web dev skills with design or math peer mentors.', icon: Repeat, color: '#34d399' },
                    { title: 'Verified Skill DNA Badge', desc: 'Cryptographic skill certificates ready for resume & LinkedIn.', icon: Award, color: '#a855f7' }
                  ].map((feat, i) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', backdropFilter: 'blur(16px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <FIcon size={18} color={feat.color} />
                          <strong style={{ fontSize: '0.94rem', color: '#ffffff' }}>{feat.title}</strong>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                    <span>🏗️ 12 Real Projects</span>
                    <span>📦 40+ Tech Modules</span>
                    <span>📜 Cryptographic Badges</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/register')}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 25px rgba(251, 113, 133, 0.4)'
                      }}
                    >
                      Try Skills Track Free <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTrackTab === 'parent' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(52, 211, 153, 0.2)', border: '1px solid rgba(52, 211, 153, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={26} color="#34d399" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.45rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>Parent Companion & Safe Telemetry Portal</h4>
                      <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>Privacy-Preserving Parent Guidance</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['🛡️ Encrypted Pairing', '📊 Daily Study Duration', '🔥 Active Streaks', '🔒 Private AI Chats'].map(b => (
                      <span key={b} style={{ fontSize: '0.76rem', fontWeight: 700, padding: '5px 12px', borderRadius: '9999px', background: 'rgba(52, 211, 153, 0.12)', color: '#d1fae5', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.65 }}>
                  Stay connected with your child's academic journey. Monitor daily study duration, active streaks, and subject completion progress while maintaining student AI chat privacy.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { title: 'Secure Pairing Key', desc: 'Link parent and student accounts using encrypted pairing keys.', icon: Lock, color: '#34d399' },
                    { title: 'Daily Study Duration', desc: 'Real-time breakdown of hours spent on subjects, labs, and quizzes.', icon: BarChart3, color: '#38bdf8' },
                    { title: 'Subject Mastery Alerts', desc: 'Receive instant notifications when student completes key milestones.', icon: ShieldCheck, color: '#fbbf24' },
                    { title: 'Private AI Tutor Shield', desc: 'Protects student private AI tutor chats while sharing telemetry.', icon: Zap, color: '#a855f7' }
                  ].map((feat, i) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', backdropFilter: 'blur(16px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <FIcon size={18} color={feat.color} />
                          <strong style={{ fontSize: '0.94rem', color: '#ffffff' }}>{feat.title}</strong>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                    <span>🛡️ 100% Privacy Safe</span>
                    <span>📊 Real-Time Telemetry</span>
                    <span>📧 Weekly Digest Reports</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/register')}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 25px rgba(52, 211, 153, 0.4)'
                      }}
                    >
                      Connect Parent Portal <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTrackTab === 'labs' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Glasses size={26} color="#38bdf8" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.45rem', color: '#ffffff', fontWeight: 900, margin: 0 }}>3D WebXR Studio & Virtual Simulation Lab</h4>
                      <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>Interactive WebGL Spatial Science Lab</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['👓 Ray Optics', '🧪 Covalent Bonding', '⚡ Circuit Simulator', '🫀 3D Heart Anatomy'].map(b => (
                      <span key={b} style={{ fontSize: '0.76rem', fontWeight: 700, padding: '5px 12px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.12)', color: '#e0f2fe', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.65 }}>
                  Perform virtual physics, chemistry, biology, and electronics experiments inside your browser using touch or mouse WebGL controls with real-time vector mathematical feedback.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {[
                    { title: 'Optics Ray Tracing', desc: 'Drag lenses & prisms to calculate refraction & focal lengths.', icon: Glasses, color: '#38bdf8' },
                    { title: '3D Molecular Bond Rotator', desc: 'Rotate valence electron orbitals in 3D WebGL space.', icon: Dna, color: '#a855f7' },
                    { title: 'Harmonic Pendulum Lab', desc: 'Adjust gravity & length constants with real-time kinetic graphs.', icon: Sparkles, color: '#34d399' },
                    { title: 'Zero VR Hardware Needed', desc: 'Runs seamlessly on standard Chrome, Safari, and Edge browsers.', icon: Zap, color: '#fbbf24' }
                  ].map((feat, i) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', backdropFilter: 'blur(16px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <FIcon size={18} color={feat.color} />
                          <strong style={{ fontSize: '0.94rem', color: '#ffffff' }}>{feat.title}</strong>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                    <span>🔬 20+ Spatial 3D Labs</span>
                    <span>🌐 WebGL Powered</span>
                    <span>📱 Mouse & Touch Controls</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/xr-studio')}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
                      }}
                    >
                      Open 3D XR Studio Now <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. TESTIMONIALS SECTION                                       */}
      {/* ------------------------------------------------------------- */}
      <section style={{ padding: '40px 24px 80px', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#34d399', background: 'rgba(52, 211, 153, 0.12)', padding: '6px 18px', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            ✦ Student & Teacher Stories
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '14px 0 0 0', color: '#ffffff' }}>
            Loved by Learners Worldwide
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            {
              quote: "Sage AI Tutor changed how I study for Class 10 Board exams. Whenever I get stuck on Math or Physics at midnight, Sage breaks down the solution step-by-step.",
              author: "Aarav Sharma",
              role: "Class 10 CBSE Student",
              rating: 5
            },
            {
              quote: "The Peer Skill Swap marketplace is brilliant! I taught React to another student in exchange for help with Linear Algebra. Zero cost and super rewarding!",
              author: "Priya Patel",
              role: "B.Tech Computer Science",
              rating: 5
            },
            {
              quote: "As a parent, the Parent Companion radar lets me see daily study time and streak progress without invading my daughter's private study sessions.",
              author: "Rajesh Kumar",
              role: "EduNova Parent",
              rating: 5
            }
          ].map((t, idx) => (
            <div key={idx} style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.96rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                "{t.quote}"
              </p>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} color="#fbbf24" fill="#fbbf24" />
                  ))}
                </div>
                <strong style={{ color: '#ffffff', fontSize: '0.98rem', display: 'block' }}>{t.author}</strong>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. FREQUENTLY ASKED QUESTIONS SECTION                          */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" style={{ padding: '40px 24px 80px', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', margin: '0 0 10px 0' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem' }}>
            Everything you need to know about EduNova platform features and account setups.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '820px', margin: '0 auto' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '20px',
                padding: '22px 26px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.04rem', color: '#ffffff', fontWeight: 700 }}>{faq.q}</strong>
                <ChevronDown size={18} color="#38bdf8" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </div>
              {openFaq === idx && (
                <p style={{ color: '#cbd5e1', fontSize: '0.94rem', marginTop: '14px', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. INTERACTIVE VIDEO / DEMO MODAL OVERLAY                      */}
      {/* ------------------------------------------------------------- */}
      {isVideoModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 22, 0.92)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '840px',
            background: 'linear-gradient(135deg, rgba(20, 28, 58, 0.95) 0%, rgba(14, 18, 42, 0.98) 100%)',
            borderRadius: '28px',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(56, 189, 248, 0.25)',
            position: 'relative',
            padding: '32px'
          }}>
            <button
              onClick={() => setIsVideoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Sparkles size={22} color="#38bdf8" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                EduNova Platform Tour & Demo
              </h3>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.94rem', marginBottom: '20px' }}>
              Experience Sage AI tutor, 3D WebXR Studio, and personalized student track command centers.
            </p>

            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#000000',
              border: '1px solid rgba(255,255,255,0.12)',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video
                controls
                autoPlay
                loop
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                <source src={videoBg} type="video/mp4" />
                <source src="/Video/EduNova(V).mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FEATURE DETAIL MODAL (Opens when clicking Explore Feature)    */}
      {/* ------------------------------------------------------------- */}
      {selectedFeatureModal && (
        <div
          onClick={() => setSelectedFeatureModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            background: 'rgba(5, 8, 22, 0.88)',
            backdropFilter: 'blur(28px) saturate(190%)',
            WebkitBackdropFilter: 'blur(28px) saturate(190%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '840px',
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(18, 26, 58, 0.94) 0%, rgba(10, 15, 36, 0.98) 100%)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              border: '1.5px solid rgba(255, 255, 255, 0.28)',
              boxShadow: `0 35px 90px rgba(0, 0, 0, 0.85), 0 0 65px ${selectedFeatureModal.color}45, inset 0 1.5px 2px rgba(255, 255, 255, 0.45)`,
              padding: '36px',
              color: '#ffffff',
              position: 'relative',
              boxSizing: 'border-box',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Ambient Ambient Radial Glow in Top Right Corner */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${selectedFeatureModal.color}35 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedFeatureModal(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(12px)',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
              }}
            >
              <X size={20} color="#ffffff" />
            </button>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%)`,
                  border: `1.5px solid rgba(255, 255, 255, 0.35)`,
                  backdropFilter: 'blur(16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 35px ${selectedFeatureModal.color}55, inset 0 1px 1px rgba(255,255,255,0.5)`
                }}>
                  {React.createElement(selectedFeatureModal.icon, { size: 32, color: selectedFeatureModal.color })}
                </div>
                <div>
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: selectedFeatureModal.color,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    border: `1px solid rgba(255, 255, 255, 0.25)`,
                    display: 'inline-block',
                    marginBottom: '6px'
                  }}>
                    ✦ {selectedFeatureModal.badge}
                  </span>
                  <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                    {selectedFeatureModal.title}
                  </h2>
                </div>
              </div>

              {/* Feature Description Paragraph */}
              <p style={{ fontSize: '1.06rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '32px' }}>
                {selectedFeatureModal.desc}
              </p>

              {/* Feature Capabilities Grid */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color={selectedFeatureModal.color} /> Core Capabilities & Architecture
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '32px' }}>
                {[
                  { title: 'AI-Powered Personalization', desc: 'Adapts in real-time to diagnostic accuracy and learning pace.', icon: Zap },
                  { title: 'Interactive Learning Tools', desc: 'Built-in diagnostic practice, flashcards, and concept maps.', icon: CheckCircle2 },
                  { title: 'Seamless System Sync', desc: 'Syncs progress across School, College, Exam, and Career tracks.', icon: ShieldCheck },
                  { title: 'Instant Performance Telemetry', desc: 'Detailed mastery telemetry and diagnostic scorecards.', icon: BarChart3 },
                ].map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={i}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(16px)',
                        padding: '18px',
                        borderRadius: '20px',
                        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.15))';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <ItemIcon size={18} color={selectedFeatureModal.color} />
                        <strong style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 800 }}>{item.title}</strong>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, display: 'block' }}>
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Modal Bottom Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.14)' }}>
                <button
                  type="button"
                  onClick={() => setSelectedFeatureModal(null)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  Close Preview
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFeatureModal(null);
                    navigate('/register');
                  }}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 25px rgba(56, 189, 248, 0.45)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(56, 189, 248, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(56, 189, 248, 0.45)';
                  }}
                >
                  Get Started Free <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. FOOTER                                                      */}
      {/* ------------------------------------------------------------- */}
      <footer id="about" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '40px 24px',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/edunova_icon.png" alt="EduNova Icon" style={{ width: '28px', height: '28px' }} />
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            © {new Date().getFullYear()} EduNova. Learn Beyond Boundaries. All rights reserved.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '0.86rem', color: '#cbd5e1' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Register</button>
          <button onClick={() => scrollToSection('features', 'Features')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Features</button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

