import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subjectService';
import { curriculumService } from '../../services/curriculumService';
import { getTopicsForSubject } from '../../data/topics';
import { useMaterials } from '../../hooks/useMaterials';
import { MaterialCard } from '../../components/materials/MaterialCard';
import { MaterialViewer } from '../../components/materials/MaterialViewer';
import { InteractiveQuiz } from '../../components/subjects/InteractiveQuiz';
import { SubjectLessonsView } from '../../components/subjects/SubjectLessonsView';
import { SubjectFlashcardsView } from '../../components/subjects/SubjectFlashcardsView';
import { SubjectNotesView } from '../../components/subjects/SubjectNotesView';
import { quizService } from '../../services/quizService';
import { 
  askSageAI, 
  generateNotes, 
  generateSummary, 
  generateFlashcards, 
  generateMCQs, 
  generatePracticeQuestions, 
  generateFormulaSheet,
  generateExplanation 
} from '../../services/aiService';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import {
  BookOpen, FileText, HelpCircle, Layers, BarChart3, Bot, Sparkles, CheckCircle2, 
  AlertCircle, PlayCircle, Plus, Send, Target, Bookmark, Edit3, Trash2, Check, Copy, 
  Zap, Clock, Calendar, Award, ChevronRight, Video, Laptop, Search, ArrowLeft, Star
} from 'lucide-react';

export const SubjectDetailsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(() => subjectService.getSubjectById(subjectId));
  const [isFav, setIsFav] = useState(() => curriculumService.isFavorite(subjectId));

  useEffect(() => {
    const handleFavUpdate = (e) => {
      if (e.detail?.subjectId === subjectId || !e.detail?.subjectId) {
        setIsFav(curriculumService.isFavorite(subjectId));
      }
    };
    window.addEventListener('edunova_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('edunova_favorites_updated', handleFavUpdate);
  }, [subjectId]);

  const handleToggleFav = () => {
    const newState = curriculumService.toggleFavorite(subjectId);
    setIsFav(newState);
  };
  const topics = getTopicsForSubject(subjectId);

  // Tabs
  const [activeTab, setActiveTab] = useState('Overview'); 
  // Overview, Lessons, Smart Materials, Practice, Quizzes, Flashcards, Notes, Personal Notes, Bookmarks, Analytics, AI Tutor

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMaterial, setActiveMaterial] = useState(null);

  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [targetScore, setTargetScore] = useState(subject.targetScore || subject.defaultTargetScore || 90);
  const [weeklyGoal, setWeeklyGoal] = useState(subject.weeklyGoal || subject.defaultWeeklyGoal || 4);
  const [targetDate, setTargetDate] = useState(subject.targetDate || '2026-12-15');

  // AI Generator state
  const [genLoading, setGenLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Quick Practice State
  const [practiceCount, setPracticeCount] = useState(10);
  const [practiceDifficulty, setPracticeDifficulty] = useState('Medium');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  // Personal Notes State
  const [personalNotes, setPersonalNotes] = useState(() => subjectService.getPersonalNotes(subjectId));
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => subjectService.getBookmarks(subjectId));

  // AI Chat state for subject
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState([
    { 
      sender: 'sage', 
      text: `Hi! I am your Sage AI Tutor for **${subject.name}** (${subject.grade || subject.degree || 'Active Track'}). I am fully aware of your current chapter (**${subject.currentChapter || 'General'}**) and weak topics (**${subject.weakTopic || 'None'}**). How can I assist you today?` 
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const { materials } = useMaterials(subjectId, 'All');

  const displayMaterials = (materials && materials.length > 0) ? materials : [
    {
      id: `mat_${subjectId}_notes_1`,
      subjectId,
      title: `📘 ${subject.name} Complete Chapter Revision Notes`,
      description: `Comprehensive theory, formulas, and key concepts for ${subject.currentChapter || subject.name}.`,
      type: 'Notes',
      tags: ['Notes', 'Revision', 'Core Theory'],
      uploadedBy: 'EduNova Academic Board',
      createdAt: '2026-09-15',
      content: `### 📘 ${subject.name} Core Revision Guide\n\n- Key operational principles and rules.\n- Essential formulas and boundary constraints.\n- Solved sample problems.`
    },
    {
      id: `mat_${subjectId}_formula_1`,
      subjectId,
      title: `🧮 ${subject.name} Essential Formula & Equation Sheet`,
      description: `Quick reference formula cheat sheet for rapid exam review.`,
      type: 'Formula Sheets',
      tags: ['Formulas', 'Cheat Sheet', 'Quick Reference'],
      uploadedBy: 'Sage AI Tutor',
      createdAt: '2026-09-16',
      content: `### 🧮 ${subject.name} Formula Reference\n\n- Primary Equations\n- Standard Constants & Units\n- Derived Relationships`
    },
    {
      id: `mat_${subjectId}_guide_1`,
      subjectId,
      title: `📖 ${subject.name} High-Yield Exam Study Guide`,
      description: `Targeted study guide covering past question patterns and mark distributions.`,
      type: 'Study Guides',
      tags: ['Study Guide', 'Exam Prep', 'High Yield'],
      uploadedBy: 'EduNova Exam Team',
      createdAt: '2026-09-14'
    },
    {
      id: `mat_${subjectId}_flash_1`,
      subjectId,
      title: `🧠 ${subject.name} Concept & Definition Flashcards`,
      description: `Interactive flashcards for fast concept mastery and definitions.`,
      type: 'Flashcards',
      tags: ['Flashcards', 'Active Recall'],
      uploadedBy: 'EduNova System',
      createdAt: '2026-09-12'
    },
    {
      id: `mat_${subjectId}_mcq_1`,
      subjectId,
      title: `🎯 High-Yield MCQs & Diagnostic Practice`,
      description: `Multiple choice practice questions with detailed step-by-step explanations.`,
      type: 'MCQs',
      tags: ['MCQs', 'Practice Test'],
      uploadedBy: 'EduNova AI',
      createdAt: '2026-09-17'
    },
    {
      id: `mat_${subjectId}_vid_1`,
      subjectId,
      title: `🎥 Interactive Video Lecture: ${subject.name} Fundamentals`,
      description: `Full visual walkthrough of key concepts, diagrams, and solved examples.`,
      type: 'Videos',
      tags: ['Video', 'Lecture', 'Visual Learning'],
      uploadedBy: 'Dr. Anita Roy',
      createdAt: '2026-09-13'
    }
  ];

  const filteredMaterials = displayMaterials.filter(m => {
    if (activeCategory === 'All') return true;
    return m.type === activeCategory || (m.tags && m.tags.includes(activeCategory));
  });

  const tabs = [
    'Overview', 'Lessons', 'Smart Materials', 'Practice', 'Quizzes', 
    'Flashcards', 'Notes', 'Personal Notes', 'Bookmarks', 'AI Tutor'
  ];

  // Smart Materials Categories with Counts
  const materialCategories = [
    { label: 'All', count: displayMaterials.length, icon: '📚' },
    { label: 'Notes', count: displayMaterials.filter(m => m.type === 'Notes').length || 8, icon: '📄' },
    { label: 'Study Guides', count: displayMaterials.filter(m => m.type === 'Study Guides').length || 12, icon: '📖' },
    { label: 'Formula Sheets', count: displayMaterials.filter(m => m.type === 'Formula Sheets').length || 5, icon: '🧮' },
    { label: 'Flashcards', count: displayMaterials.filter(m => m.type === 'Flashcards').length || 42, icon: '🧠' },
    { label: 'Practice Questions', count: 35, icon: '📝' },
    { label: 'MCQs', count: displayMaterials.filter(m => m.type === 'MCQs').length || 120, icon: '🎯' },
    { label: 'Previous Questions', count: 15, icon: '📚' },
    { label: 'Diagrams', count: 6, icon: '📊' },
    { label: 'Videos', count: displayMaterials.filter(m => m.type === 'Videos').length || 12, icon: '🎥' }
  ];

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const updated = subjectService.updateSubjectConfig(subjectId, {
      targetScore: parseInt(targetScore, 10),
      weeklyGoal: parseFloat(weeklyGoal),
      targetDate
    });
    setSubject(subjectService.getSubjectById(subjectId));
    setIsGoalModalOpen(false);
  };

  const handleAskSageQuick = async (promptText) => {
    setActiveTab('AI Tutor');
    setAiLoading(true);
    setAiChat(prev => [...prev, { sender: 'user', text: promptText }]);

    const res = await askSageAI(promptText, [], { 
      subjectName: subject.name, 
      topicName: subject.currentChapter,
      weakTopic: subject.weakTopic 
    });
    setAiChat(prev => [...prev, { sender: 'sage', text: res.text }]);
    setAiLoading(false);
  };

  const handleSendAiMessage = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput('');
    handleAskSageQuick(userMsg);
  };

  const handleGenerateMaterial = async (typeKey) => {
    setGenLoading(true);
    setGeneratedResult(null);

    const subj = subject.name;
    const top = subject.currentChapter || 'Core Principles';
    let res = null;

    try {
      if (typeKey === 'notes') res = await generateNotes(subj, top);
      else if (typeKey === 'summary') res = await generateSummary(subj, top);
      else if (typeKey === 'flashcards') res = await generateFlashcards(subj, top, 5);
      else if (typeKey === 'mcqs') res = await generateMCQs(subj, top, 10);
      else if (typeKey === 'practice') res = await generatePracticeQuestions(subj, top);
      else if (typeKey === 'formula') res = await generateFormulaSheet(subj, top);
      else if (typeKey === 'explain') res = await generateExplanation(subj, top);

      setGeneratedResult({ type: typeKey, data: res });
    } catch (e) {
      console.error('Generation error:', e);
    } finally {
      setGenLoading(false);
    }
  };

  const handleStartQuickPractice = () => {
    const quiz = quizService.generateSubjectQuiz(
      subjectId, 
      subject.currentChapter || 'General Concepts', 
      practiceDifficulty, 
      practiceCount
    );
    setActiveQuiz(quiz);
    setQuizScore(null);
    setActiveTab('Practice');
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    let updated;
    if (editingNoteId) {
      updated = subjectService.updatePersonalNote(editingNoteId, {
        title: noteTitle,
        content: noteContent
      });
      setEditingNoteId(null);
    } else {
      updated = subjectService.savePersonalNote({
        subjectId,
        subjectName: subject.name,
        title: noteTitle,
        content: noteContent
      });
    }

    setPersonalNotes(updated.filter(n => n.subjectId === subjectId));
    setNoteTitle('');
    setNoteContent('');
  };

  const handleEditNoteClick = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleDeleteNote = (id) => {
    const updated = subjectService.deletePersonalNote(id);
    setPersonalNotes(updated.filter(n => n.subjectId === subjectId));
    if (editingNoteId === id) {
      handleCancelEditNote();
    }
  };

  const handleToggleBookmark = (item) => {
    const updated = subjectService.toggleBookmark({ subjectId, ...item });
    setBookmarks(updated.filter(b => b.subjectId === subjectId));
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '16px' }}>
      
      {/* 0. TOP NAVIGATION ROW WITH BACK BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate('/my-subjects')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-cyan)',
            fontSize: '0.86rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: 'var(--glass-shadow)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <ArrowLeft size={16} /> Back to My Subjects
        </button>

        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Subject Workspace & AI Learning Environment
        </span>
      </div>

      {/* 1. SUBJECT HEADER BANNER */}
      <div style={{
        background: `linear-gradient(135deg, ${subject.color || '#06b6d4'}25, rgba(99, 102, 241, 0.2))`,
        borderRadius: 'var(--radius-xl)',
        border: `1px solid ${subject.color || 'var(--border-color)'}`,
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '2.5rem', background: 'var(--glass-bg)', padding: '12px 18px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            {subject.icon || '📚'}
          </span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="cyber-badge-cyan">{subject.grade || subject.degree || subject.level || 'Subject'}</span>
              <span className="cyber-badge-amber">Priority: {subject.defaultPriority || 'High'}</span>
              <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Zap size={13} /> {subject.xp || 240} XP
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              {subject.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0' }}>
              {subject.description}
            </p>
          </div>
        </div>

        {/* Goal Metrics & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Target: <strong style={{ color: '#34d399' }}>{targetScore}%</strong> • Weekly: <strong>{weeklyGoal}h</strong>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: subject.color || 'var(--accent-cyan)' }}>
              {(typeof subject.progress === 'number' ? subject.progress : 0)}% Complete
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Target Date: {targetDate}
            </div>
          </div>

          <Button variant="outline" onClick={() => setIsGoalModalOpen(true)} style={{ fontSize: '0.82rem', padding: '8px 12px' }}>
            <Target size={14} /> Edit Goal
          </Button>

          <button
            onClick={handleToggleFav}
            title={isFav ? 'Remove Favorite' : 'Save Subject'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isFav ? 'rgba(251, 191, 36, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              border: isFav ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.2)',
              color: isFav ? '#fbbf24' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isFav ? '0 0 16px rgba(251, 191, 36, 0.45)' : 'none'
            }}
          >
            <Star size={18} fill={isFav ? '#fbbf24' : 'transparent'} color={isFav ? '#fbbf24' : '#ffffff'} />
          </button>

          <button
            onClick={() => handleAskSageQuick(`Explain ${subject.currentChapter || subject.name} in detail`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.16)';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} /> Ask Sage AI
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              fontWeight: activeTab === tab ? 800 : 500,
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              background: activeTab === tab ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
              border: activeTab === tab ? '1px solid var(--accent-cyan)' : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENTS */}

      {/* OVERVIEW TAB */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ✨ GENERATE WITH SAGE AI TOOLBAR */}
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', padding: '16px 20px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> ✨ GENERATE WITH SAGE AI
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Context: {subject.name} • {subject.currentChapter || 'Chapter 1'}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'notes', label: 'Generate Notes', icon: <FileText size={13} /> },
                { id: 'summary', label: 'Generate Summary', icon: <Sparkles size={13} /> },
                { id: 'flashcards', label: 'Generate Flashcards', icon: <Layers size={13} /> },
                { id: 'mcqs', label: 'Generate MCQs', icon: <HelpCircle size={13} /> },
                { id: 'practice', label: 'Generate Practice', icon: <BookOpen size={13} /> },
                { id: 'formula', label: 'Generate Formula Sheet', icon: <Layers size={13} /> },
                { id: 'explain', label: 'Explain Topic', icon: <Bot size={13} /> }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => handleGenerateMaterial(btn.id)}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>

            {/* AI Generator Output Box */}
            {genLoading && (
              <div style={{ marginTop: '14px', padding: '14px', textAlign: 'center', color: '#38bdf8', fontSize: '0.88rem' }}>
                <Sparkles className="animate-spin" size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Sage AI is generating your study content for {subject.name}...
              </div>
            )}

            {!genLoading && generatedResult && (
              <div style={{ marginTop: '14px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#38bdf8', textTransform: 'uppercase' }}>
                    Generated {generatedResult.type}
                  </strong>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(generatedResult.data));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5, maxHeight: '220px', overflowY: 'auto' }}>
                  {generatedResult.data.text || JSON.stringify(generatedResult.data)}
                </div>
              </div>
            )}
          </div>

          {/* ⚡ QUICK PRACTICE widget */}
          <div style={{ background: 'var(--glass-bg)', padding: '20px 24px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
                  <Zap size={18} /> ⚡ Quick Practice
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Test yourself before leaving.</span>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[5, 10, 20].map(c => (
                    <button
                      key={c}
                      onClick={() => setPracticeCount(c)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: practiceCount === c ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        color: practiceCount === c ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    >
                      {c} Qs
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => setPracticeDifficulty(d)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: practiceDifficulty === d ? '#38bdf8' : 'var(--bg-tertiary)',
                        color: practiceDifficulty === d ? '#000' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <Button size="sm" onClick={handleStartQuickPractice}>
                  <PlayCircle size={15} /> Start {practiceCount} Qs
                </Button>
              </div>
            </div>
          </div>

          {/* CHAPTER & TOPIC HIERARCHY */}
          <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--accent-cyan)" /> Chapter & Topic Hierarchy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topics.map((t, idx) => (
                <div
                  key={t.id}
                  style={{
                    background: t.isCurrent ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-secondary)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-lg)',
                    border: t.isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: t.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-tertiary)', border: t.completed ? '1px solid #10b981' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', color: t.completed ? '#34d399' : 'var(--text-secondary)' }}>
                      {t.completed ? '✓' : idx + 1}
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{t.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.desc}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {t.isWeak && <span className="cyber-badge-amber" style={{ fontSize: '0.7rem' }}>Weak Area</span>}
                    {t.isCurrent && <span className="cyber-badge-cyan" style={{ fontSize: '0.7rem' }}>Current Chapter</span>}
                    <Button size="sm" variant="outline" onClick={() => handleAskSageQuick(`Explain ${t.name} topic in detail`)}>
                      Study Topic
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LESSONS TAB */}
      {activeTab === 'Lessons' && (
        <SubjectLessonsView
          subject={subject}
          topics={topics}
          onAskSage={handleAskSageQuick}
          onSelectMaterial={setActiveMaterial}
        />
      )}

      {/* SMART MATERIALS TAB */}
      {(activeTab === 'Smart Materials' || activeTab === 'Materials') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Categorized Counts Toolbar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {materialCategories.map(cat => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: activeCategory === cat.label ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: activeCategory === cat.label ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{cat.icon}</span> {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
            {filteredMaterials.map(mat => (
              <MaterialCard
                key={mat.id}
                material={mat}
                onView={(m) => setActiveMaterial(m)}
                onAskSage={(m) => handleAskSageQuick(`Explain concept in "${m.title}" material`)}
                onBookmark={(m) => handleToggleBookmark(m)}
              />
            ))}
          </div>
        </div>
      )}

      {/* FLASHCARDS TAB */}
      {activeTab === 'Flashcards' && (
        <SubjectFlashcardsView
          subject={subject}
          topics={topics}
          onAskSage={handleAskSageQuick}
        />
      )}

      {/* NOTES & PERSONAL NOTES TABS */}
      {(activeTab === 'Notes' || activeTab === 'Personal Notes') && (
        <SubjectNotesView
          subject={subject}
          topics={topics}
          onAskSage={handleAskSageQuick}
        />
      )}

      {/* PRACTICE & QUIZZES TAB */}
      {(activeTab === 'Practice' || activeTab === 'Quizzes') && (
        <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
          {!activeQuiz ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <HelpCircle size={44} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Subject Diagnostic Practice Quiz</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Test your accuracy in <strong>{subject.currentChapter || subject.name}</strong>. Sage AI will evaluate weak concepts instantly.
              </p>
              <Button size="lg" onClick={handleStartQuickPractice}>
                Start {practiceCount}-Question Practice Quiz
              </Button>
            </div>
          ) : (
            <InteractiveQuiz 
              quiz={activeQuiz} 
              onReset={() => setActiveQuiz(null)} 
              subjectName={subject.name} 
              topicName={activeQuiz.topicName} 
            />
          )}
        </div>
      )}

      {/* PERSONAL NOTES TAB */}
      {activeTab === 'Personal Notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
          
          {/* Note Form */}
          <div style={{ gridColumn: 'span 5' }} className="col-span-12">
            <div style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={16} color="var(--accent-cyan)" /> {editingNoteId ? 'Edit Personal Note' : 'Add Personal Note'}
              </h4>
              <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Note Title (e.g. Formula Derivation)"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  required
                />
                <textarea
                  rows={4}
                  placeholder="Write your note observations..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  required
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="submit" style={{ flex: 1 }}>
                    {editingNoteId ? <><Edit3 size={16} /> Update Note</> : <><Plus size={16} /> Save Personal Note</>}
                  </Button>
                  {editingNoteId && (
                    <Button type="button" variant="outline" onClick={handleCancelEditNote}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Notes List */}
          <div style={{ gridColumn: 'span 7' }} className="col-span-12">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {personalNotes.length > 0 ? (
                personalNotes.map(n => (
                  <div key={n.id} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{n.title}</strong>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditNoteClick(n)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }} title="Edit Note">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteNote(n.id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }} title="Delete Note">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {n.content}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                      Created: {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', background: 'var(--glass-bg)', borderRadius: '16px', color: 'var(--text-secondary)' }}>
                  No personal notes created yet for {subject.name}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOOKMARKS TAB */}
      {activeTab === 'Bookmarks' && (
        <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={18} color="#fbbf24" /> Saved Subject Bookmarks
          </h3>

          {bookmarks.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {bookmarks.map(b => (
                <div key={b.id} style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{b.title || b.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.type || 'Saved Resource'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>No bookmarked items yet. Click bookmark on any material to save it here.</p>
          )}
        </div>
      )}

      {/* AI TUTOR TAB */}
      {activeTab === 'AI Tutor' && (
        <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '400px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} color="var(--accent-cyan)" /> Sage AI Academic Tutor for {subject.name}
          </h3>

          {/* Quick Action Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              'Explain this chapter',
              'Give me 10 MCQs',
              'Make revision notes',
              'Test me',
              'Explain my weak topic',
              'Create flashcards'
            ].map(chip => (
              <button
                key={chip}
                onClick={() => handleAskSageQuick(chip)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px', paddingRight: '8px' }}>
            {aiChat.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--glass-bg)',
                  border: msg.sender === 'user' ? '1px solid #0284c7' : '1px solid var(--border-color)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.88rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                {msg.text}
              </div>
            ))}
            {aiLoading && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sage AI is thinking...</div>}
          </div>

          <form onSubmit={handleSendAiMessage} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder={`Ask Sage AI anything about ${subject.name}...`}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              style={{ flex: 1, height: '42px', borderRadius: 'var(--radius-md)' }}
            />
            <Button type="submit" disabled={aiLoading}>
              <Send size={16} /> Send
            </Button>
          </form>
        </div>
      )}

      {/* EDIT GOAL MODAL */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={`Edit Goal for ${subject.name}`}>
        <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Target Score %</label>
            <input
              type="number"
              min="50"
              max="100"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Weekly Study Hours</label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="30"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Target Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button variant="secondary" type="button" onClick={() => setIsGoalModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Goal</Button>
          </div>
        </form>
      </Modal>

      {/* Material Viewer Modal */}
      <MaterialViewer
        material={activeMaterial}
        onClose={() => setActiveMaterial(null)}
        onAskSage={(m) => handleAskSageQuick(`Explain concept in "${m.title}" material`)}
      />
    </div>
  );
};

export default SubjectDetailsPage;
