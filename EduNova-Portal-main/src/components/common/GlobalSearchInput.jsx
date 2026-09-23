import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  History,
  Trash2,
  Sparkles,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Bot,
  LayoutDashboard,
  Share2,
  Repeat,
  Calendar,
  BarChart2,
  FileText,
  Code
} from 'lucide-react';
import {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
  searchGlobalData,
  POPULAR_SEARCH_SUGGESTIONS
} from '../../services/searchService';

// Icon resolver helper with glowing icon container
const renderCategoryIcon = (iconName, isLight = false) => {
  const iconProps = { size: 16, style: { flexShrink: 0 } };
  switch (iconName) {
    case 'FlaskConical': return <FlaskConical {...iconProps} color="#ec4899" />;
    case 'Sparkles': return <Sparkles {...iconProps} color="#a855f7" />;
    case 'Bot': return <Bot {...iconProps} color="#38bdf8" />;
    case 'BookOpen': return <BookOpen {...iconProps} color="#6366f1" />;
    case 'LayoutDashboard': return <LayoutDashboard {...iconProps} color="#10b981" />;
    case 'Share2': return <Share2 {...iconProps} color="#8b5cf6" />;
    case 'Repeat': return <Repeat {...iconProps} color="#06b6d4" />;
    case 'Calendar': return <Calendar {...iconProps} color="#f59e0b" />;
    case 'BarChart2': return <BarChart2 {...iconProps} color="#38bdf8" />;
    case 'FileText': return <FileText {...iconProps} color="#10b981" />;
    case 'Code': return <Code {...iconProps} color="#6366f1" />;
    default: return <Search {...iconProps} color={isLight ? '#0284c7' : '#38bdf8'} />;
  }
};

export const GlobalSearchInput = ({
  placeholder = "Search subjects, courses, skills...",
  isLight = false,
  containerStyle = {},
  onSelectResult = null
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load history on mount
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Update live search results when query changes
  useEffect(() => {
    if (query.trim()) {
      const results = searchGlobalData(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K to focus search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Submit search query or select result
  const handleExecuteSearch = (targetQuery, path = null) => {
    if (!targetQuery || !targetQuery.trim()) return;
    const clean = targetQuery.trim();
    
    // Add to history
    const updatedHistory = addSearchHistory(clean);
    setHistory(updatedHistory);
    
    setQuery(clean);
    setIsOpen(false);

    if (onSelectResult) {
      onSelectResult(clean, path);
    }

    if (path) {
      navigate(path);
    } else {
      // Default to subjects page with query param if no specific path
      navigate(`/subjects?search=${encodeURIComponent(clean)}`);
    }
  };

  // Delete a specific history item
  const handleRemoveHistoryItem = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = removeSearchHistoryItem(item);
    setHistory(updated);
  };

  // Clear all search history
  const handleClearAllHistory = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = clearSearchHistory();
    setHistory(updated);
  };

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        handleExecuteSearch(searchResults[0].title, searchResults[0].path);
      } else if (query.trim()) {
        handleExecuteSearch(query);
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        ...containerStyle
      }}
    >
      {/* SEARCH INPUT BAR PILL */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 22px',
          borderRadius: '9999px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(238, 244, 255, 0.88) 100%)'
            : 'linear-gradient(135deg, rgba(25, 36, 75, 0.78) 0%, rgba(14, 20, 48, 0.88) 100%)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: isOpen
            ? (isLight ? '1.5px solid #0284c7' : '1.5px solid #06b6d4')
            : (isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1.5px solid rgba(255, 255, 255, 0.18)'),
          boxShadow: isOpen
            ? (isLight
                ? '0 0 0 4px rgba(6, 182, 212, 0.2), 0 12px 35px rgba(64, 100, 160, 0.2)'
                : '0 0 25px rgba(6, 182, 212, 0.45), 0 12px 35px rgba(0, 0, 0, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.3)')
            : (isLight
                ? '0 12px 35px rgba(64, 100, 160, 0.14), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
                : '0 12px 35px rgba(0, 0, 0, 0.4), inset 0 1px 1.5px rgba(255, 255, 255, 0.18)'),
          transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'text'
        }}
      >
        <Search
          size={18}
          color={isOpen ? '#06b6d4' : (isLight ? '#0284c7' : '#38bdf8')}
          style={{
            flexShrink: 0,
            filter: isOpen ? 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))' : 'none',
            transition: 'all 0.2s ease'
          }}
        />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: isLight ? '#0f172a' : '#ffffff',
            fontSize: '0.92rem',
            fontWeight: 600,
            fontFamily: 'inherit'
          }}
        />

        {query ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              setSearchResults([]);
              inputRef.current?.focus();
            }}
            style={{
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLight ? '#64748b' : '#cbd5e1',
              transition: 'all 0.2s ease'
            }}
            title="Clear search input"
          >
            <X size={14} />
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 9px',
              borderRadius: '8px',
              background: isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(255, 255, 255, 0.08)',
              border: isLight ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid rgba(255, 255, 255, 0.16)',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: isLight ? '#0284c7' : '#38bdf8',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <span>Ctrl</span>
            <span>K</span>
          </div>
        )}
      </div>

      {/* DROPDOWN OVERLAY (HISTORY, SUGGESTIONS & INSTANT RESULTS) */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            right: 0,
            zIndex: 99999,
            background: isLight
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 246, 255, 0.94) 100%)'
              : 'linear-gradient(135deg, rgba(16, 23, 52, 0.94) 0%, rgba(10, 14, 36, 0.97) 100%)',
            backdropFilter: 'blur(36px) saturate(200%) contrast(105%)',
            WebkitBackdropFilter: 'blur(36px) saturate(200%) contrast(105%)',
            border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1.5px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '24px',
            boxShadow: isLight
              ? '0 25px 65px rgba(64, 100, 160, 0.2), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
              : '0 30px 80px rgba(0, 0, 0, 0.75), 0 0 45px rgba(99, 102, 241, 0.25), inset 0 1.5px 2px rgba(255, 255, 255, 0.25)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxHeight: '520px',
            overflowY: 'auto'
          }}
        >
          {/* SCENARIO A: EMPTY QUERY -> SHOW RECENT SEARCHES (WITH REMOVE OPTION) & POPULAR SUGGESTIONS */}
          {!query.trim() && (
            <>
              {/* RECENT SEARCHES */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', color: isLight ? '#0284c7' : '#38bdf8' }}>
                    <History size={15} color="#06b6d4" style={{ filter: 'drop-shadow(0 0 5px rgba(6, 182, 212, 0.5))' }} />
                    <span>Recent Searches</span>
                  </div>

                  {history.length > 0 && (
                    <button
                      onClick={handleClearAllHistory}
                      style={{
                        background: 'rgba(244, 63, 94, 0.14)',
                        border: '1px solid rgba(244, 63, 94, 0.35)',
                        color: '#f43f5e',
                        cursor: 'pointer',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 2px 8px rgba(244, 63, 94, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(244, 63, 94, 0.4)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(244, 63, 94, 0.14)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(244, 63, 94, 0.2)';
                        e.currentTarget.style.transform = 'none';
                      }}
                      title="Clear all search history"
                    >
                      <Trash2 size={12} color="#f43f5e" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div style={{ padding: '12px 16px', fontSize: '0.86rem', color: isLight ? '#94a3b8' : '#64748b', fontStyle: 'italic', background: isLight ? 'rgba(245, 249, 255, 0.6)' : 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', border: isLight ? '1px dashed rgba(210, 225, 250, 0.8)' : '1px dashed rgba(255, 255, 255, 0.1)' }}>
                    No recent searches recorded yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {history.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleExecuteSearch(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '14px',
                          background: isLight
                            ? 'rgba(245, 249, 255, 0.9)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                          border: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          backdropFilter: 'blur(12px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isLight
                            ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.9))'
                            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))';
                          e.currentTarget.style.borderColor = isLight ? '#6366f1' : 'rgba(56, 189, 248, 0.5)';
                          e.currentTarget.style.transform = 'translateX(3px)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isLight
                            ? 'rgba(245, 249, 255, 0.9)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                          e.currentTarget.style.borderColor = isLight ? 'rgba(210, 225, 250, 0.8)' : 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <History size={15} color="#06b6d4" />
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isLight ? '#0f172a' : '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item}
                          </span>
                        </div>

                        {/* REMOVE SINGLE HISTORY ITEM OPTION */}
                        <button
                          onClick={(e) => handleRemoveHistoryItem(e, item)}
                          style={{
                            background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255, 255, 255, 0.08)',
                            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.14)',
                            borderRadius: '50%',
                            width: '26px',
                            height: '26px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isLight ? '#94a3b8' : '#94a3b8',
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#f43f5e';
                            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = isLight ? '#94a3b8' : '#94a3b8';
                            e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.14)';
                          }}
                          title={`Remove "${item}" from history`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* POPULAR / TRENDING SUGGESTIONS */}
              <div style={{ borderTop: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', color: isLight ? '#7c3aed' : '#c084fc', marginBottom: '12px' }}>
                  <Sparkles size={15} color="#a855f7" style={{ filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.5))' }} />
                  <span>Popular Suggestions</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
                  {POPULAR_SEARCH_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug.id}
                      onClick={() => handleExecuteSearch(sug.query, sug.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        background: isLight
                          ? 'linear-gradient(135deg, rgba(240, 246, 255, 0.95) 0%, rgba(225, 236, 255, 0.88) 100%)'
                          : 'linear-gradient(135deg, rgba(30, 42, 80, 0.65) 0%, rgba(18, 26, 60, 0.75) 100%)',
                        border: isLight ? '1px solid rgba(199, 210, 254, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                        color: isLight ? '#1e3a8a' : '#e2e8f0',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isLight ? '0 4px 12px rgba(100, 130, 200, 0.12)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(12px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(168, 85, 247, 0.25))';
                        e.currentTarget.style.borderColor = '#06b6d4';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isLight
                          ? 'linear-gradient(135deg, rgba(240, 246, 255, 0.95) 0%, rgba(225, 236, 255, 0.88) 100%)'
                          : 'linear-gradient(135deg, rgba(30, 42, 80, 0.65) 0%, rgba(18, 26, 60, 0.75) 100%)';
                        e.currentTarget.style.borderColor = isLight ? 'rgba(199, 210, 254, 0.9)' : 'rgba(255, 255, 255, 0.16)';
                        e.currentTarget.style.color = isLight ? '#1e3a8a' : '#e2e8f0';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = isLight ? '0 4px 12px rgba(100, 130, 200, 0.12)' : '0 4px 15px rgba(0, 0, 0, 0.3)';
                      }}
                    >
                      {renderCategoryIcon(sug.icon, isLight)}
                      <span>{sug.query}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SCENARIO B: ACTIVE QUERY -> LIVE MATCHED RESULTS */}
          {query.trim() && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', color: isLight ? '#0284c7' : '#38bdf8' }}>
                  Search Results ({searchResults.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600 }}>
                  Press Enter to search
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div
                  onClick={() => handleExecuteSearch(query, '/chat')}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: isLight
                      ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.9))'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                    border: '1.5px dashed #6366f1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.borderColor = '#06b6d4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(99, 102, 241, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                      <Bot size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                        Ask Sage AI about "{query}"
                      </div>
                      <div style={{ fontSize: '0.8rem', color: isLight ? '#475569' : '#cbd5e1' }}>
                        Get instant Socratic answers, notes, or step-by-step study paths
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={18} color="#06b6d4" />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {searchResults.map((res, index) => (
                    <div
                      key={index}
                      onClick={() => handleExecuteSearch(res.title, res.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        background: isLight ? 'rgba(245, 249, 255, 0.9)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                        border: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        backdropFilter: 'blur(12px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isLight
                          ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.9))'
                          : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))';
                        e.currentTarget.style.borderColor = isLight ? '#6366f1' : 'rgba(56, 189, 248, 0.5)';
                        e.currentTarget.style.transform = 'translateX(3px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isLight ? 'rgba(245, 249, 255, 0.9)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                        e.currentTarget.style.borderColor = isLight ? 'rgba(210, 225, 250, 0.8)' : 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {renderCategoryIcon(res.icon, isLight)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {res.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {res.subtitle}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontWeight: 800,
                            background: isLight ? 'rgba(99, 102, 241, 0.12)' : 'rgba(6, 182, 212, 0.2)',
                            color: isLight ? '#4f46e5' : '#38bdf8',
                            border: isLight ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(6, 182, 212, 0.4)'
                          }}
                        >
                          {res.category}
                        </span>
                        <ArrowRight size={15} color={isLight ? '#64748b' : '#94a3b8'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchInput;
