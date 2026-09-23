import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { useLearner } from '../../context/LearnerContext';
import { useSubjects } from '../../hooks/useSubjects';
import { learnerService } from '../../services/learnerService';
import { updateUserProfile } from '../../services/userService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import {
  User, Mail, Award, Flame, BookOpen, Repeat, Edit, Save, LogOut,
  CheckCircle2, Clock, Target, Plus, ExternalLink, GitBranch, Globe,
  Sparkles, Share2, Eye, Shield, Lock, GraduationCap, School, Briefcase,
  Trophy, ChevronRight, Check, X, AlertCircle, RefreshCw, Code, Trash2,
  Camera, Upload, Image as ImageIcon
} from 'lucide-react';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';

import { useUserProgress } from '../../hooks/useUserProgress';
import { getDynamicAvatar } from '../../utils/avatarUtils';

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { xp, level, streakDays } = useLearning();
  const { learner, updateProfile } = useLearner();
  const { selectedSubjects } = useSubjects();
  const { progress } = useUserProgress();
  const navigate = useNavigate();

  // Ref for file input element
  const fileInputRef = useRef(null);

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [copyNotice, setCopyNotice] = useState('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Helper functions for track-tailored defaults
  const activeLearnerType = (learner?.learnerType || user?.learnerType || 'school').toLowerCase();

  const getDefaultTitle = (track) => {
    switch (track) {
      case 'school': return 'School Learner';
      case 'exam': return 'Exam Aspirant';
      case 'skills': return 'Skills Learner';
      case 'college':
      default: return 'College Learner';
    }
  };

  const getDefaultBio = (track) => {
    switch (track) {
      case 'school': return 'Passionate school student mastering Mathematics, Physics, and Science.';
      case 'exam': return 'Targeting top percentile scores in competitive entrance examinations.';
      case 'skills': return 'Learning practical skills, web development, and software tools.';
      case 'college':
      default: return 'Passionate student exploring modern web architecture and computer science.';
    }
  };

  const getDefaultSkillsOffered = (track) => {
    switch (track) {
      case 'school': return ['Mathematics & Algebra', 'Physics Concepts', 'Chemistry Fundamentals', 'Python Basics'];
      case 'exam': return ['Speed Math & Aptitude', 'Physics Mechanics', 'Logical Reasoning', 'General Awareness'];
      case 'skills': return ['Full Stack Web Dev', 'React.js', 'Python Programming', 'UI/UX Design'];
      case 'college':
      default: return ['React.js', 'JavaScript', 'HTML/CSS', 'Python Foundations'];
    }
  };

  const getDefaultSkillsWanted = (track) => {
    switch (track) {
      case 'school': return ['Advanced Calculus', 'Organic Chemistry', 'Robotics & STEM', 'CBSE Board Strategy'];
      case 'exam': return ['JEE Advanced Calculus', 'CMAT Speed Hacks', 'Mock Test Strategy', 'Data Interpretation'];
      case 'skills': return ['Next.js', 'Docker & Kubernetes', 'System Design', 'AI & Machine Learning'];
      case 'college':
      default: return ['TypeScript', 'Docker', 'Machine Learning', 'GraphQL'];
    }
  };

  // Editable Profile fields
  const [name, setName] = useState(user?.name || learner?.name || 'Alex Mercer');
  const [username, setUsername] = useState(learner?.username || user?.studentUsername || user?.username || 'alexmercer');
  const [title, setTitle] = useState(() => {
    const raw = user?.title || learner?.title;
    if (raw && !raw.toLowerCase().includes('full stack') && !raw.toLowerCase().includes('college')) {
      return raw;
    }
    return getDefaultTitle(activeLearnerType);
  });
  const [bio, setBio] = useState(() => {
    const raw = user?.bio || learner?.bio;
    if (raw && !raw.toLowerCase().includes('modern web architecture')) {
      return raw;
    }
    return getDefaultBio(activeLearnerType);
  });
  const [avatar, setAvatar] = useState(() => getDynamicAvatar(user?.avatar || learner?.avatar, user?.name || learner?.name || 'Alex Mercer'));
  const [visibility, setVisibility] = useState(learner?.visibility || 'members');

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Education state
  const [eduDetails, setEduDetails] = useState(learner?.education || {
    degree: activeLearnerType === 'school' ? '' : 'B.Tech',
    branch: activeLearnerType === 'school' ? '' : 'Computer Science & Engineering',
    university: activeLearnerType === 'school' ? '' : 'EduNova Institute of Technology',
    semester: activeLearnerType === 'school' ? '' : 'Semester 4',
    class: 'Class 10',
    board: 'CBSE',
    academicYear: '2025–2026',
    examName: 'JEE Main / CMAT',
    targetYear: '2026',
    targetDate: '2026-11-15',
    careerDomain: activeLearnerType === 'school' ? 'STEM & Higher Education' : 'Full Stack Web Development',
    careerRole: activeLearnerType === 'school' ? 'Student' : 'Software Engineer'
  });

  // Project state
  const [projects, setProjects] = useState(learner?.projects || [
    {
      id: 'proj_1',
      name: 'EduNova 3D Visualizer',
      description: 'Interactive spatial learning visualizer for STEM concepts using WebGL.',
      tech: 'React, Three.js, WebGL',
      github: 'https://github.com',
      demo: 'https://edunova.app'
    },
    {
      id: 'proj_2',
      name: 'Realtime Study Room',
      description: 'Collaborative audio chat & canvas notebook for student study groups.',
      tech: 'Node.js, WebRTC, Socket.io',
      github: 'https://github.com',
      demo: 'https://edunova.app'
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tech: '',
    github: '',
    demo: ''
  });

  // Learning Goals state
  const [goals, setGoals] = useState(() => learnerService.getLearningGoals());
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');

  // Timeline
  const timeline = learnerService.getLearningTimeline();
  const completionPercent = learnerService.calculateProfileCompletion();

  // Sync edits when learner changes
  useEffect(() => {
    if (learner) {
      const currentTrack = (learner.learnerType || 'school').toLowerCase();
      if (learner.name) setName(learner.name);
      if (learner.username) setUsername(learner.username);
      
      const rawTitle = learner.title || user?.title;
      if (rawTitle && !rawTitle.toLowerCase().includes('full stack') && !rawTitle.toLowerCase().includes('college')) {
        setTitle(rawTitle);
      } else {
        setTitle(getDefaultTitle(currentTrack));
      }

      const rawBio = learner.bio || user?.bio;
      if (rawBio && !rawBio.toLowerCase().includes('modern web architecture')) {
        setBio(rawBio);
      } else {
        setBio(getDefaultBio(currentTrack));
      }

      if (learner.avatar && !learner.avatar.includes('photo-1534528741775-53994a69daeb')) {
        setAvatar(learner.avatar);
      } else {
        setAvatar(getDynamicAvatar(user || learner, name));
      }
      if (learner.visibility) setVisibility(learner.visibility);
      if (learner.education) setEduDetails(prev => ({ ...prev, ...learner.education }));
      if (learner.projects) setProjects(learner.projects);
    }
  }, [learner, user]);

  // Username validation handler
  const handleUsernameChange = async (val) => {
    const cleaned = val.replace(/\s+/g, '');
    setUsername(cleaned);
    if (!cleaned) {
      setUsernameStatus(null);
      return;
    }
    setCheckingUsername(true);
    const result = await learnerService.checkUsernameAvailability(cleaned);
    setCheckingUsername(false);
    setUsernameStatus(result);
  };

  // Handle image file selection from computer (Base64 conversion)
  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WEBP, GIF).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size exceeds 5MB limit. Please select a smaller photo.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setAvatar(base64Image);
        updateUser({ avatar: base64Image });
        updateProfile({ avatar: base64Image });
        learnerService.setProfile({ avatar: base64Image });

        try {
          await updateUserProfile({ avatar: base64Image });
          setCopyNotice('✓ Profile photo saved successfully!');
        } catch (err) {
          setCopyNotice('✓ Profile photo updated locally!');
        }
        setTimeout(() => setCopyNotice(''), 3500);
        setIsPhotoModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPhotoUrl = async (e) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;
    setAvatar(customPhotoUrl);
    updateUser({ avatar: customPhotoUrl });
    updateProfile({ avatar: customPhotoUrl });
    learnerService.setProfile({ avatar: customPhotoUrl });

    try {
      await updateUserProfile({ avatar: customPhotoUrl });
      setCopyNotice('✓ Profile photo updated from URL!');
    } catch (err) {
      setCopyNotice('✓ Profile photo updated locally!');
    }
    setTimeout(() => setCopyNotice(''), 3500);
    setCustomPhotoUrl('');
    setIsPhotoModalOpen(false);
  };

  const handleRemovePhoto = async () => {
    const defaultAvatar = getDynamicAvatar(user, name);
    setAvatar(defaultAvatar);
    updateUser({ avatar: defaultAvatar });
    updateProfile({ avatar: defaultAvatar });
    learnerService.setProfile({ avatar: defaultAvatar });
    try {
      await updateUserProfile({ avatar: defaultAvatar });
    } catch (err) {}
    setCopyNotice('Profile photo reset to default');
    setTimeout(() => setCopyNotice(''), 3000);
    setIsPhotoModalOpen(false);
  };

  const handleSaveProfile = async () => {
    if (usernameStatus && !usernameStatus.available && username !== (learner?.username || user?.studentUsername || 'alexmercer')) {
      alert('Please select an available username before saving.');
      return;
    }

    const updated = {
      name,
      username,
      studentUsername: username,
      title,
      bio,
      avatar,
      visibility,
      education: eduDetails,
      projects
    };

    updateUser({
      name,
      studentUsername: username,
      title,
      bio,
      avatar
    });
    updateProfile(updated);
    learnerService.setProfile(updated);
    setIsEditing(false);

    try {
      await updateUserProfile({
        name,
        username,
        studentUsername: username,
        avatar,
        title,
        bio,
        board: eduDetails.board || undefined,
        degree: eduDetails.degree || undefined,
        education: eduDetails
      });
      setCopyNotice('✓ Profile changes saved successfully!');
    } catch (err) {
      console.warn('Backend profile update notice:', err.message);
      setCopyNotice('✓ Profile updated successfully!');
    }
    setTimeout(() => setCopyNotice(''), 3500);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const handleShareProfile = () => {
    const link = `${window.location.origin}/profile/${username || 'me'}`;
    navigator.clipboard.writeText(link);
    setCopyNotice('Profile link copied to clipboard!');
    setTimeout(() => setCopyNotice(''), 3000);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    const added = [
      ...projects,
      { id: `proj_${Date.now()}`, ...newProject }
    ];
    setProjects(added);
    updateProfile({ projects: added });
    learnerService.setProfile({ projects: added });
    try {
      await updateUserProfile({ projects: added });
      setCopyNotice('✓ Project added to portfolio!');
    } catch (err) {
      setCopyNotice('✓ Project saved locally!');
    }
    setTimeout(() => setCopyNotice(''), 3500);
    setNewProject({ name: '', description: '', tech: '', github: '', demo: '' });
    setIsProjectModalOpen(false);
  };

  const handleRemoveProject = async (id) => {
    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    updateProfile({ projects: filtered });
    learnerService.setProfile({ projects: filtered });
    try {
      await updateUserProfile({ projects: filtered });
      setCopyNotice('Project removed from portfolio');
    } catch (err) {}
    setTimeout(() => setCopyNotice(''), 3000);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const updated = learnerService.addLearningGoal({
      title: newGoalTitle,
      targetDate: newGoalDate || '2026-12-31',
      progress: 10
    });
    setGoals(updated);
    setNewGoalTitle('');
    setNewGoalDate('');
    setIsGoalModalOpen(false);
  };

  const missingItems = [];
  if (!username) missingItems.push('Add unique @username');
  if (!eduDetails.degree && !eduDetails.class && !eduDetails.examName) missingItems.push('Add education details');
  if (goals.length === 0) missingItems.push('Add learning goal');
  if (!bio) missingItems.push('Add bio & title');

  const learnerType = learner?.learnerType || 'college';

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 0. HERO BRANDING BANNER WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ Learner Verification Profile"
        title="My Learner Profile"
        subtitle="Manage your personal academic identity, verified skill evidence, project portfolio, and learning goals."
        stats={[
          { label: `Level ${level}`, subtext: `${xp} XP Earned`, icon: Award, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: `${streakDays || 7}`, subtext: 'Day Streak', icon: Flame, color: '#f59e0b', iconBg: 'rgba(245, 158, 11, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />
      
      {/* Toast Notification Notice */}
      {copyNotice && (
        <div style={{
          position: 'fixed',
          top: '88px',
          right: '24px',
          zIndex: 9999,
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={18} /> {copyNotice}
        </div>
      )}      {/* Hidden File Input for Device Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        style={{ display: 'none' }}
      />

      {/* ========================================================================= */}
      {/* 1. PRESERVED ORIGINAL PROFILE HEADER BANNER (ENHANCED STYLING)           */}
      {/* ========================================================================= */}
      <Card style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(56, 189, 248, 0.25)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
            title="Click to Upload Profile Photo from Computer"
          >
            <img
              src={getDynamicAvatar(avatar || user?.avatar || learner?.avatar, name)}
              alt={name}
              style={{
                width: '104px',
                height: '104px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-cyan)',
                boxShadow: '0 0 24px rgba(56, 189, 248, 0.35)',
                transition: 'transform 0.2s ease'
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                background: 'var(--accent-cyan)',
                color: '#000',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0f172a',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
              title="Upload Photo from Computer (JPG, PNG, WEBP)"
            >
              <Camera size={16} />
            </button>
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px', maxWidth: '640px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      color: '#fff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>

                {/* Unique Username (@) */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                    Unique Username (@)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <span style={{ padding: '10px 14px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.95rem', borderRight: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      @
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="username"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {checkingUsername && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Checking availability...</span>}
                  {usernameStatus && (
                    <span style={{ fontSize: '0.8rem', color: usernameStatus.available ? '#34d399' : '#fb7185', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                      {usernameStatus.message}
                    </span>
                  )}
                </div>

                {/* Headline / Title */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                    Headline / Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Full Stack & AI Enthusiast"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      color: '#fff',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                    Profile Bio
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief bio about your learning journey..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{name}</h1>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.12)', padding: '3px 12px', borderRadius: '16px', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    @{username}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '6px', textTransform: 'capitalize', border: '1px solid var(--border-color)' }}>
                    <Shield size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {visibility} Profile
                  </span>
                </div>
                <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.98rem', marginBottom: '8px' }}>{title}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '620px', lineHeight: '1.5', marginBottom: '16px' }}>{bio}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSaveProfile} style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)' }}>
                    <Save size={16} /> Save Profile Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit size={16} /> Edit Profile
                </Button>
              )}

              <Button size="sm" variant="outline" onClick={handleShareProfile}>
                <Share2 size={16} /> Share Profile
              </Button>

              <Button size="sm" variant="outline" onClick={handleLogout} style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fb7185' }}>
                <LogOut size={16} /> Log Out
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(168, 85, 247, 0.3)', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.15)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>LEVEL</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7', marginTop: '2px' }}>Lvl {level}</p>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(129, 140, 248, 0.3)', boxShadow: '0 4px 14px rgba(129, 140, 248, 0.15)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>ENERGY</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8', marginTop: '2px' }}>{xp} XP</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 2. PRESERVED ORIGINAL SKILLS YOU CAN TEACH & SKILLS YOU WANT TO LEARN     */}
      {/* ========================================================================= */}
      <div className="dashboard-grid">
        <div className="col-span-6">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>Skills You Can Teach</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Expertise</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(
                (user?.skillsOffered && user.skillsOffered.length > 0) ? user.skillsOffered :
                (learner?.skillsOffered && learner.skillsOffered.length > 0) ? learner.skillsOffered :
                getDefaultSkillsOffered(activeLearnerType)
              ).map((s) => (
                <span key={typeof s === 'string' ? s : s.name} className="cyber-badge-cyan">
                  {typeof s === 'string' ? s : `${s.name} ${s.level ? `(${s.level}%)` : ''}`}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-6">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#a855f7' }}>Skills You Want to Learn</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Learning Goals</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(
                (user?.skillsWanted && user.skillsWanted.length > 0) ? user.skillsWanted :
                (learner?.skillsWanted && learner.skillsWanted.length > 0) ? learner.skillsWanted :
                getDefaultSkillsWanted(activeLearnerType)
              ).map((s) => (
                <span key={typeof s === 'string' ? s : s.name} className="cyber-badge">
                  {typeof s === 'string' ? s : `${s.name} ${s.level ? `(${s.level}%)` : ''}`}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROFILE COMPLETION & VISIBILITY CARD                                   */}
      {/* ========================================================================= */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-cyan)' }} /> Profile Completion
              </span>
              <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1rem' }}>{completionPercent}%</span>
            </div>
            
            <ProgressBar progress={completionPercent} color="linear-gradient(90deg, #38bdf8, #818cf8, #a855f7)" height={10} />

            {missingItems.length > 0 ? (
              <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Missing details to reach 100%:</span>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {missingItems.map((item, idx) => (
                    <span key={idx} style={{ color: '#fb7185', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      • {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ marginTop: '8px', fontSize: '0.82rem', color: '#34d399' }}>✓ Your profile is 100% complete and production-ready!</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>PROFILE VISIBILITY</span>
              <select
                value={visibility}
                onChange={(e) => {
                  setVisibility(e.target.value);
                  updateProfile({ visibility: e.target.value });
                  learnerService.setProfile({ visibility: e.target.value });
                }}
                style={{
                  background: 'transparent',
                  color: 'var(--accent-cyan)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="public" style={{ background: '#0f172a' }}>Public (Anyone with link)</option>
                <option value="members" style={{ background: '#0f172a' }}>EduNova Members Only</option>
                <option value="private" style={{ background: '#0f172a' }}>Private (Only Me)</option>
              </select>
            </div>

            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit size={14} /> Complete Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 4. EDUNOVA LEARNING IDENTITY & SAGE AI INSIGHT                            */}
      {/* ========================================================================= */}
      <div className="dashboard-grid">
        {/* EduNova Learning Identity */}
        <div className="col-span-6">
          <Card style={{ height: '100%', borderLeft: '4px solid #a855f7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} style={{ color: '#a855f7' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>EduNova Learning Identity</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRENT LEVEL</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a855f7' }}>Level {level}</p>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ENERGY / XP</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{xp} XP</p>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOP MASTERY SKILL</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {learner?.skills?.[0]?.name || 'React.js (85%)'}
                </p>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LEARNING STREAK</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fb7185' }}>
                  <Flame size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {streakDays || 14} Days
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sage AI Profile Insight */}
        <div className="col-span-6">
          <Card style={{ height: '100%', borderLeft: '4px solid #38bdf8', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(15, 23, 42, 0.6))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: '#38bdf8' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Sage AI Profile Insight</h3>
              </div>
              <span className="cyber-badge-cyan" style={{ fontSize: '0.7rem' }}>AI Powered</span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
              "Your recent activity demonstrates steady mastery in {learnerType === 'college' ? 'Computer Science & Full Stack Engineering' : 'Mathematics & Science'}. Your next recommended practice area is Advanced State Management & Data Structures."
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button size="sm" onClick={() => navigate('/chat')}>
                <Sparkles size={14} /> Ask Sage AI
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/study-planner')}>
                <Target size={14} /> View Recommendations
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DYNAMIC EDUCATION CARD                                                */}
      {/* ========================================================================= */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Education & Academic Track</h3>
          </div>
          <div>
            {isEditing ? (
              <select
                value={learnerType}
                onChange={(e) => {
                  const newType = e.target.value;
                  updateProfile({ learnerType: newType });
                  learnerService.setProfile({ learnerType: newType });
                  if (updateUser) updateUser({ learnerType: newType.toUpperCase() });
                }}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="school">School Track</option>
                <option value="college">College Track</option>
                <option value="skills">Skills Track</option>
                <option value="exam">Exam Track</option>
              </select>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 10px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 700 }}>
                {learnerType} Track
              </span>
            )}
          </div>
        </div>

        {learnerType === 'school' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CLASS / STANDARD</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.class || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, class: e.target.value }))}
                  placeholder="Class 10"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.class || 'Class 10'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EDUCATION BOARD</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.board || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, board: e.target.value }))}
                  placeholder="CBSE / ICSE"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.board || 'CBSE Board'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACADEMIC YEAR</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.academicYear || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, academicYear: e.target.value }))}
                  placeholder="2025–2026"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.academicYear || '2025–2026'}</p>
              )}
            </div>
          </div>
        )}

        {learnerType === 'college' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DEGREE</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.degree || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, degree: e.target.value }))}
                  placeholder="B.Tech / BCA"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.degree || 'B.Tech'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BRANCH / MAJOR</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.branch || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, branch: e.target.value }))}
                  placeholder="Computer Science"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.branch || 'Computer Science & Engineering'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UNIVERSITY / INSTITUTE</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.university || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, university: e.target.value }))}
                  placeholder="Institute Name"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.university || 'EduNova Institute of Technology'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SEMESTER</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.semester || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, semester: e.target.value }))}
                  placeholder="Semester 4"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.semester || 'Semester 4'}</p>
              )}
            </div>
          </div>
        )}

        {learnerType === 'exam' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARGET EXAM</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.examName || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, examName: e.target.value }))}
                  placeholder="JEE / NEET / CMAT"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.examName || 'CMAT / JEE National Exam'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARGET YEAR</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.targetYear || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, targetYear: e.target.value }))}
                  placeholder="2026"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.targetYear || '2026'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARGET EXAM DATE</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.targetDate || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, targetDate: e.target.value }))}
                  placeholder="15 November 2026"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.targetDate || '15 November 2026'}</p>
              )}
            </div>
          </div>
        )}

        {learnerType === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CAREER DOMAIN</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.careerDomain || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, careerDomain: e.target.value }))}
                  placeholder="Full Stack Web Development"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.careerDomain || 'Full Stack Web Development'}</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARGET ROLE</span>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.careerRole || ''}
                  onChange={(e) => setEduDetails((prev) => ({ ...prev, careerRole: e.target.value }))}
                  placeholder="Frontend Software Engineer"
                  style={{ width: '100%', marginTop: '6px', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', color: '#fff' }}
                />
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{eduDetails.careerRole || 'Frontend Software Engineer'}</p>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 6. MY SUBJECTS GRID                                                      */}
      {/* ========================================================================= */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>My Enrolled Subjects</h3>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate('/my-subjects')}>
            Manage Subjects <ChevronRight size={14} />
          </Button>
        </div>

        {selectedSubjects && selectedSubjects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {selectedSubjects.map((sub) => {
              const prog = typeof sub.progress === 'number' ? sub.progress : 0;
              const topic = sub.currentTopic || (sub.weakTopic && prog > 0 ? sub.weakTopic : 'Core Foundations & Practice');
              return (
                <div
                  key={sub.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{sub.icon || '📚'}</span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: (sub.priority || 'Medium') === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                        color: (sub.priority || 'Medium') === 'High' ? '#f87171' : '#38bdf8'
                      }}>
                        {sub.priority || 'Medium'} Priority
                      </span>
                    </div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '4px' }}>{sub.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Current Topic: <span style={{ color: 'var(--text-secondary)' }}>{topic}</span>
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{prog}%</span>
                    </div>
                    <ProgressBar progress={prog} color="linear-gradient(90deg, #38bdf8, #818cf8)" height={6} />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/subjects/${sub.id}`)}
                      style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                    >
                      Open Subject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data yet — Enroll in subjects to track your academic progress.</p>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 7. LEARNING GOALS & CURRENT LEARNING FOCUS                               */}
      {/* ========================================================================= */}
      <div className="dashboard-grid">
        {/* Learning Goals Card */}
        <div className="col-span-6">
          <Card style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} style={{ color: '#a855f7' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Learning Goals</h3>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsGoalModalOpen(true)}>
                <Plus size={14} /> Add Goal
              </Button>
            </div>

            {goals && goals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {goals.map((g) => (
                  <div key={g.id} style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{g.title}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7' }}>{g.progress || 0}%</span>
                    </div>
                    <ProgressBar progress={g.progress || 0} color="linear-gradient(90deg, #a855f7, #ec4899)" height={5} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      <span>Target Date: {g.targetDate || '2026-12-31'}</span>
                      <span style={{ color: '#34d399' }}>{g.status || 'Active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No data yet — Add a learning goal to track milestones.</p>
            )}
          </Card>
        </div>

        {/* Current Learning Focus */}
        <div className="col-span-6">
          <Card style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Current Learning Focus</h3>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>Active Topic</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px', marginBottom: '8px' }}>
                {selectedSubjects?.[0]?.currentTopic || 'React Hooks & State Management'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Next Action: <span style={{ color: '#fff', fontWeight: 600 }}>Practice asynchronous state management & custom hook design.</span>
              </p>
            </div>

            <Button size="sm" onClick={() => navigate('/study-planner')} style={{ width: '100%', justifyContent: 'center' }}>
              Continue Learning <ChevronRight size={16} />
            </Button>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. LEARNING STATISTICS ROW                                               */}
      {/* ========================================================================= */}
      <Card>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Learning Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <Clock size={20} style={{ color: '#38bdf8', margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>STUDY HOURS</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {progress?.studyMinutes > 0 ? `${(progress.studyMinutes / 60).toFixed(1)} hrs` : (learner?.stats?.studyHours && learner.stats.studyHours !== '14.5 hrs' ? learner.stats.studyHours : '0 hrs')}
            </span>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <CheckCircle2 size={20} style={{ color: '#34d399', margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>QUIZ ACCURACY</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {progress?.completedQuizzes > 0 ? `${Math.round(progress.quizTotalScoreSum / progress.completedQuizzes)}%` : (learner?.stats?.quizAccuracy && learner.stats.quizAccuracy !== '88%' ? learner.stats.quizAccuracy : '0%')}
            </span>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <BookOpen size={20} style={{ color: '#a855f7', margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>TOPICS FINISHED</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {progress?.completedLessons > 0 ? `${progress.completedLessons} Topics` : (learner?.stats?.topicsCompleted && learner.stats.topicsCompleted !== '24 Topics' ? learner.stats.topicsCompleted : '0 Topics')}
            </span>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <Flame size={20} style={{ color: '#fb7185', margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>LEARNING STREAK</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>{streakDays || 0} Days</span>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <Trophy size={20} style={{ color: '#f59e0b', margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>ACHIEVEMENTS</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {progress?.achievementsUnlocked > 0 ? `${progress.achievementsUnlocked} Unlocked` : (learner?.stats?.achievementsCount && learner.stats.achievementsCount !== '12 Unlocked' ? learner.stats.achievementsCount : '0 Unlocked')}
            </span>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <Award size={20} style={{ color: '#818cf8', margin: '0 auto 6px' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>ENERGY / XP</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>{xp || 0} XP</span>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 9. RECENT LEARNING ACTIVITY & ACHIEVEMENTS PREVIEW                        */}
      {/* ========================================================================= */}
      <div className="dashboard-grid">
        {/* Activity Timeline */}
        <div className="col-span-6">
          <Card style={{ height: '100%' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Recent Learning Activity</h3>
            {timeline && timeline.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {timeline.map((act) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{act.icon || '✓'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{act.title}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.timestamp}</span>
                    </div>
                    {act.xp && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                        {act.xp}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No data yet — Complete quizzes or lessons to see recent activity.</p>
            )}
          </Card>
        </div>

        {/* Achievements Preview */}
        <div className="col-span-6">
          <Card style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Achievements</h3>
              <Button size="sm" variant="outline" onClick={() => navigate('/achievements')}>
                View All <ChevronRight size={14} />
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <span style={{ fontSize: '1.4rem' }}>🏆</span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>Quiz Champion</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Scored 90%+ accuracy in 5 consecutive quizzes</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid rgba(251, 113, 133, 0.2)' }}>
                <span style={{ fontSize: '1.4rem' }}>🔥</span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fb7185' }}>7-Day Streak Master</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Maintained daily study streak for 7 consecutive days</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <span style={{ fontSize: '1.4rem' }}>✨</span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a855f7' }}>Constellation Architect</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Mapped 15+ knowledge nodes in spatial constellation</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. PROJECT PORTFOLIO                                                    */}
      {/* ========================================================================= */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>My Projects Portfolio</h3>
          </div>
          <Button size="sm" onClick={() => setIsProjectModalOpen(true)}>
            <Plus size={14} /> Add Project
          </Button>
        </div>

        {projects && projects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{proj.name}</h4>
                    <button
                      onClick={() => handleRemoveProject(proj.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Remove Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>{proj.description}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '12px' }}>
                    {proj.tech}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      <GitBranch size={14} /> Code
                    </a>
                  )}
                  {proj.demo && (
                    <a href={proj.demo} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>
                      <Globe size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No projects showcased yet — click "+ Add Project" to feature your work.</p>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* ADD PROJECT MODAL                                                         */}
      {/* ========================================================================= */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Showcase New Project">
        <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Project Name *</label>
            <input
              type="text"
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="e.g. EduNova WebGL Sandbox"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Description</label>
            <textarea
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief description of features & goals..."
              style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Technologies / Frameworks</label>
            <input
              type="text"
              value={newProject.tech}
              onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
              placeholder="e.g. React, Node.js, WebGL"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>GitHub Link</label>
              <input
                type="url"
                value={newProject.github}
                onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                placeholder="https://github.com/..."
                style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Live Demo Link</label>
              <input
                type="url"
                value={newProject.demo}
                onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                placeholder="https://myproject.app"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button type="button" variant="outline" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Project</Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD GOAL MODAL                                                            */}
      {/* ========================================================================= */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Set New Learning Goal">
        <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Goal Title *</label>
            <input
              type="text"
              required
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="e.g. Master React State Management"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Target Completion Date</label>
            <input
              type="date"
              value={newGoalDate}
              onChange={(e) => setNewGoalDate(e.target.value)}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button type="button" variant="outline" onClick={() => setIsGoalModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MANAGE PROFILE PHOTO MODAL                                               */}
      {/* ========================================================================= */}
      <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} title="Manage Profile Photo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          {/* Avatar Preview */}
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <img
              src={avatar}
              alt="Avatar Preview"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-cyan)',
                boxShadow: '0 0 28px rgba(56, 189, 248, 0.4)'
              }}
            />
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Supported Formats: JPG, PNG, WEBP, GIF (Max 5MB)
            </p>
          </div>

          {/* Option 1: File Upload */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(90deg, #38bdf8, #6366f1)', padding: '12px' }}
          >
            <Upload size={18} /> Upload Photo from Computer
          </Button>

          <div style={{ width: '100%', textAlign: 'center', borderBottom: '1px solid var(--border-color)', leading: '0.1em', margin: '4px 0' }}>
            <span style={{ background: '#0f172a', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR PASTE URL</span>
          </div>

          {/* Option 2: Image URL */}
          <form onSubmit={handleApplyPhotoUrl} style={{ width: '100%', display: 'flex', gap: '10px' }}>
            <input
              type="url"
              value={customPhotoUrl}
              onChange={(e) => setCustomPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{ flex: 1, padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
            />
            <Button type="submit" size="sm">Apply URL</Button>
          </form>

          {/* Option 3: Reset Photo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
            <Button type="button" variant="outline" onClick={handleRemovePhoto} style={{ color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.4)' }}>
              <Trash2 size={14} /> Reset Default
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsPhotoModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


