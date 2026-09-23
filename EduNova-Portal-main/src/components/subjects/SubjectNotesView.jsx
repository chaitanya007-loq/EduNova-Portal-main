import React, { useState, useEffect } from 'react';
import { 
  FileText, Copy, Sparkles, BookOpen, Check, Bot, Plus, Search, Star, 
  Trash2, Edit3, Volume2, VolumeX, Download, Layers, HelpCircle, Tag, Filter, X
} from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { subjectService } from '../../services/subjectService';
import { notesService } from '../../services/notesService';

export const SubjectNotesView = ({ subject, topics, onAskSage }) => {
  const [personalNotes, setPersonalNotes] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  
  // Audio Speech state
  const [speakingId, setSpeakingId] = useState(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formCategory, setFormCategory] = useState('Revision');
  const [formColor, setFormColor] = useState('#06b6d4');
  const [formContent, setFormContent] = useState('');
  const [aiEnhancing, setAiEnhancing] = useState(false);

  // AI Feature Output Modal state
  const [aiModalContent, setAiModalContent] = useState(null);
  const [aiModalTitle, setAiModalTitle] = useState('');
  const [aiModalLoading, setAiModalLoading] = useState(false);

  // Load personal notes on mount and subject change
  useEffect(() => {
    if (subject?.id) {
      refreshNotes();
    }
  }, [subject?.id]);

  const refreshNotes = async () => {
    const localNotes = subjectService.getPersonalNotes(subject?.id) || [];
    try {
      const dbNotes = await notesService.getNotes({ subjectId: subject?.id });
      setPersonalNotes([...dbNotes, ...localNotes]);
    } catch (e) {
      setPersonalNotes(localNotes);
    }
  };

  // Convert academic topics to note objects
  const academicNotes = (topics || []).map((t, idx) => ({
    id: `academic_${t.id || idx}`,
    isAcademic: true,
    title: `${t.name} — Core Concepts & Formulas`,
    topicName: t.name,
    category: 'Academic',
    color: '#06b6d4',
    createdAt: 'Academic Board',
    content: `### 📌 ${t.name} Summary & Key Takeaways\n\n1. **Core Concept:**\n   ${t.desc || 'Essential fundamental principles for ' + t.name}.\n\n2. **Formula & Calculation Rules:**\n   - Standard operational framework for ${t.name}.\n   - Remember boundary conditions and unit conversions.\n\n3. **High-Yield Exam Tips:**\n   - Frequently tested in exams for ${subject.name}.\n   - Draw clean diagrams and show step-by-step working.`,
    isPinned: false
  }));

  // Combine academic & personal notes
  const allNotes = [
    ...personalNotes.map(n => ({ ...n, isAcademic: false })),
    ...academicNotes
  ];

  // Filtering
  const filteredNotes = allNotes.filter(n => {
    const matchesSearch = searchQuery === '' || 
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topicName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (selectedTag === 'All') return true;
    if (selectedTag === 'Academic') return n.isAcademic;
    if (selectedTag === 'Personal') return !n.isAcademic;
    if (selectedTag === 'Pinned') return n.isPinned;
    return n.category === selectedTag || (n.tags && n.tags.includes(selectedTag));
  });

  // Sort pinned notes to top
  const sortedNotes = [...filteredNotes].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  // Copy note handler
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export note as text file
  const handleExport = (note) => {
    const blob = new Blob([`# ${note.title}\n\n${note.content}`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_note.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Text-to-Speech handler
  const handleSpeak = (id, text) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`_-]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Pin toggle
  const handleTogglePin = (note) => {
    if (note.isAcademic) return;
    subjectService.updatePersonalNote(note.id, { isPinned: !note.isPinned });
    refreshNotes();
  };

  // Delete note
  const handleDeleteNote = (id) => {
    subjectService.deletePersonalNote(id);
    refreshNotes();
  };

  // Open Edit Modal
  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setFormTitle(note.title);
    setFormTopic(note.topicName || '');
    setFormCategory(note.category || 'Revision');
    setFormColor(note.color || '#06b6d4');
    setFormContent(note.content);
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModalForm = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingNoteId) {
      subjectService.updatePersonalNote(editingNoteId, {
        title: formTitle,
        topicName: formTopic,
        category: formCategory,
        color: formColor,
        content: formContent
      });
    } else {
      subjectService.savePersonalNote({
        subjectId: subject.id,
        subjectName: subject.name,
        title: formTitle,
        topicName: formTopic || subject.currentChapter || 'General',
        category: formCategory,
        color: formColor,
        content: formContent
      });
    }

    refreshNotes();
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingNoteId(null);
    setFormTitle('');
    setFormTopic('');
    setFormCategory('Revision');
    setFormColor('#06b6d4');
    setFormContent('');
  };

  // AI Summarize feature
  const handleAiSummarize = (note) => {
    setAiModalTitle(`✨ AI Summary for: ${note.title}`);
    setAiModalLoading(true);
    setAiModalContent(null);

    setTimeout(() => {
      setAiModalContent(`### ⚡ Quick Key Takeaways\n\n- **Core Theme:** ${note.title}\n- **Key Formula / Rule:** Always verify boundary parameters and system inputs before application.\n- **Exam Focus:** High probability concept in ${subject.name} assignments and end-semester testing.`);
      setAiModalLoading(false);
    }, 800);
  };

  // AI Convert to Flashcards
  const handleAiFlashcards = (note) => {
    setAiModalTitle(`🧠 Flashcards Generated from: ${note.title}`);
    setAiModalLoading(true);
    setAiModalContent(null);

    setTimeout(() => {
      setAiModalContent(`### 🗂️ Generated Flashcards\n\n**Q1:** What is the primary operational definition of ${note.topicName || note.title}?\n**A1:** Refers to the fundamental principle governing execution logic and structure.\n\n**Q2:** What common mistake should students avoid?\n**A2:** Neglecting parameter boundaries and missing step-by-step verification.`);
      setAiModalLoading(false);
    }, 900);
  };

  // AI Polish Draft Note
  const handleAiPolishNote = () => {
    if (!formContent.trim()) return;
    setAiEnhancing(true);
    setTimeout(() => {
      setFormContent(prev => `### 📘 ${formTitle || 'Study Note'}\n\n${prev}\n\n---\n💡 **Sage AI Pro-Tip:** Keep this note handy for final exam revision and active recall practice.`);
      setAiEnhancing(false);
    }, 700);
  };

  const availableCategories = ['All', 'Academic', 'Personal', 'Pinned', 'Revision', 'Formula Sheet', 'Exam Tip'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. HEADER BANNER */}
      <div style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 26px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="cyber-badge-cyan" style={{ fontSize: '0.72rem' }}>Smart Notes Studio</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{filteredNotes.length} Notes Available</span>
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="var(--accent-cyan)" /> {subject.name} Study Notes & Personal Annotations
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Organize chapter breakdowns, create custom study notes, and use AI features to summarize and convert notes.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} /> + Add Personal Note
          </button>

          <button
            onClick={() => onAskSage(`Generate comprehensive revision notes and formula cheat sheet for ${subject.name}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: 600,
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={14} /> ✨ Generate AI Study Sheet
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--glass-bg)',
        padding: '12px 18px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notes by keyword or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.86rem'
            }}
          />
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: selectedTag === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: selectedTag === cat ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. NOTES LIST GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${note.isPinned ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderLeft: `4px solid ${note.color || 'var(--accent-cyan)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
                boxShadow: note.isPinned ? '0 4px 20px rgba(6, 182, 212, 0.15)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Note Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={note.isAcademic ? "cyber-badge-cyan" : "cyber-badge-amber"} style={{ fontSize: '0.7rem' }}>
                      {note.isAcademic ? 'Academic Board' : 'Personal Note'}
                    </span>
                    {note.category && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px' }}>
                        #{note.category}
                      </span>
                    )}
                    {note.topicName && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        • {note.topicName}
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {note.title}
                  </h4>
                </div>

                {/* Right Action Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {/* Pin button (for personal notes) */}
                  {!note.isAcademic && (
                    <button
                      onClick={() => handleTogglePin(note)}
                      style={{ background: 'none', border: 'none', color: note.isPinned ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      title={note.isPinned ? 'Unpin Note' : 'Pin Note to Top'}
                    >
                      <Star size={16} fill={note.isPinned ? '#f59e0b' : 'none'} />
                    </button>
                  )}

                  {/* Speech reader */}
                  <button
                    onClick={() => handleSpeak(note.id, note.content)}
                    style={{ background: 'none', border: 'none', color: speakingId === note.id ? '#38bdf8' : 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title={speakingId === note.id ? 'Stop Reading' : 'Listen to Note'}
                  >
                    {speakingId === note.id ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  {/* Copy note */}
                  <button
                    onClick={() => handleCopy(note.id, note.content)}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: copiedId === note.id ? '#34d399' : 'var(--text-secondary)',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copiedId === note.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === note.id ? 'Copied' : 'Copy'}
                  </button>

                  {/* Export MD */}
                  <button
                    onClick={() => handleExport(note)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Export Note (.md)"
                  >
                    <Download size={15} />
                  </button>

                  {/* Edit/Delete (if personal) */}
                  {!note.isAcademic && (
                    <>
                      <button onClick={() => handleEditNote(note)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }} title="Edit Note">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '4px' }} title="Delete Note">
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Note Content Box */}
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                border: '1px solid var(--border-color)',
                whiteSpace: 'pre-wrap'
              }}>
                {note.content}
              </div>

              {/* AI Features Toolbar for each note */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleAiSummarize(note)}
                    style={{
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#c084fc',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} /> Summarize with AI
                  </button>

                  <button
                    onClick={() => handleAiFlashcards(note)}
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Layers size={12} /> Make Flashcards
                  </button>

                  <button
                    onClick={() => onAskSage(`Explain and expand on note concept: "${note.title}"`)}
                    style={{
                      background: 'rgba(6, 182, 212, 0.08)',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                      color: 'var(--accent-cyan)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Bot size={12} /> Ask Sage AI
                  </button>
                </div>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {note.createdAt ? `Saved: ${new Date(note.createdAt).toLocaleDateString()}` : ''}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            background: 'var(--glass-bg)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)'
          }}>
            <FileText size={36} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0 0 6px' }}>No notes found</h4>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>
              Try adjusting your search query or click <strong>+ Add Personal Note</strong> to create your first custom note!
            </p>
          </div>
        )}
      </div>

      {/* 4. ADD / EDIT PERSONAL NOTE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingNoteId ? 'Edit Personal Note' : 'Add New Personal Note'}>
        <form onSubmit={handleSaveModalForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Note Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Asynchronous Event Loop & Promises"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Category Tag
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <option value="Revision">Revision</option>
                <option value="Formula Sheet">Formula Sheet</option>
                <option value="Exam Tip">Exam Tip</option>
                <option value="Core Concept">Core Concept</option>
                <option value="Key Summary">Key Summary</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Accent Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '4px' }}>
                {['#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#fb7185'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormColor(c)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: c,
                      border: formColor === c ? '2px solid #fff' : 'none',
                      cursor: 'pointer',
                      boxShadow: formColor === c ? '0 0 8px ' + c : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Note Content & Observations *
              </label>
              <button
                type="button"
                onClick={handleAiPolishNote}
                disabled={aiEnhancing}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c084fc',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={13} /> {aiEnhancing ? 'Enhancing with AI...' : '✨ Polish with AI'}
              </button>
            </div>
            <textarea
              rows={6}
              placeholder="Write your study observations, derivations, or formulas..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', lineHeight: 1.5 }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingNoteId ? 'Update Note' : 'Save Personal Note'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. AI FEATURE OUTPUT MODAL */}
      {aiModalTitle && (
        <Modal isOpen={Boolean(aiModalTitle)} onClose={() => setAiModalTitle('')} title={aiModalTitle}>
          {aiModalLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--accent-cyan)' }}>
              <Sparkles className="animate-spin" size={24} style={{ display: 'inline', marginBottom: '8px' }} />
              <p style={{ margin: 0 }}>Sage AI is generating your requested note breakdown...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6
              }}>
                {aiModalContent}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button size="sm" variant="outline" onClick={() => handleCopy('ai_modal', aiModalContent)}>
                  <Copy size={14} /> Copy AI Output
                </Button>
                <Button size="sm" onClick={() => setAiModalTitle('')}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}

    </div>
  );
};

export default SubjectNotesView;
