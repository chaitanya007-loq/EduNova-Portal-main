import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Video,
  Calendar,
  Sparkles,
  ChevronLeft,
  Pin,
  Users,
  CheckCircle,
  Clock,
  HelpCircle,
  X,
  Globe,
  Code,
  Layout,
  Database,
  Target,
  FolderGit2,
  Briefcase,
  Bot,
  Play
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';
import {
  getConversationsList,
  getMessagesForConversation,
  sendChatMessage,
  toggleMessageReaction,
  togglePinMessage,
  markConversationAsRead
} from '../../services/chatService';

import { uploadChatFile } from '../../services/chatFileService';
import { MessageActionsMenu } from './MessageActionsMenu';
import { MediaViewerModal } from './MediaViewerModal';
import { SageChatAssistantDrawer } from './SageChatAssistantDrawer';
import { ExchangeSessionModeModal } from './ExchangeSessionModeModal';
import { PeerQuizModal } from './PeerQuizModal';
import { MeetingRequestModal } from './MeetingRequestModal';
import { MeetingRoomModal } from '../exchange/MeetingRoomModal';

export const ChatPage = ({ defaultConversationId = null, onOpenScheduler }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(defaultConversationId || 'conv_rahul');
  const [messages, setMessages] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'direct' | 'exchange' | 'community' | 'group'
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile View State
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar' | 'chat'

  // Message Composer State
  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [, setUploadProgress] = useState(0);
  const [stagedAttachment, setStagedAttachment] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Modals & Interactive Features State
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [activeMediaAttachment, setActiveMediaAttachment] = useState(null);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isSageDrawerOpen, setIsSageDrawerOpen] = useState(false);
  const [sageMessageTarget, setSageMessageTarget] = useState(null);
  const [sageMode, setSageMode] = useState('explain');
  const [isSessionModeOpen, setIsSessionModeOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  // Interactive Quiz & Meeting Request Modals State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isMeetingRequestOpen, setIsMeetingRequestOpen] = useState(false);
  const [activeMeetingObj, setActiveMeetingObj] = useState(null);
  const [isMeetingRoomOpen, setIsMeetingRoomOpen] = useState(false);

  // Auto-scroll ref
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Dynamic Resizable Sidebar Width State
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('edunova_chat_sidebar_width');
    return saved ? Number(saved) : 260;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !chatContainerRef.current) return;
      const rect = chatContainerRef.current.getBoundingClientRect();
      const newWidth = Math.max(180, Math.min(480, e.clientX - rect.left));
      setSidebarWidth(newWidth);
      localStorage.setItem('edunova_chat_sidebar_width', newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // 1. Initial Load & Listeners
  useEffect(() => {
    const list = getConversationsList();
    setConversations(list);
    if (list.length > 0) {
      const found = list.find(c => c.id === activeConversationId);
      if (!found) setActiveConversationId(list[0].id);
    }
  }, []);

  // 2. Fetch Messages on Active Conversation Change
  useEffect(() => {
    if (activeConversationId) {
      const msgs = getMessagesForConversation(activeConversationId);
      setMessages(msgs);
      markConversationAsRead(activeConversationId);
      setConversations(getConversationsList());
      scrollToBottom();
    }
  }, [activeConversationId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 3. Filter & Search Logic
  const filteredConversations = conversations.filter(c => {
    const titleMatch = (c.title || c.channelName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (c.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!titleMatch) return false;

    if (filterType === 'unread') return (c.unreadCount || 0) > 0;
    if (filterType === 'direct') return c.type === 'direct';
    if (filterType === 'exchange') return c.type === 'exchange';
    if (filterType === 'community') return c.type === 'community';
    if (filterType === 'group') return c.type === 'group';
    return true;
  });

  // Auto-fallback if active conversation gets filtered out
  useEffect(() => {
    if (filteredConversations.length > 0) {
      const isStillInList = filteredConversations.some(c => c.id === activeConversationId);
      if (!isStillInList) {
        setActiveConversationId(filteredConversations[0].id);
      }
    }
  }, [filterType, searchQuery]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0] || {};

  // 4. File Upload Handlers
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  };

  const processFileUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const attachmentObj = await uploadChatFile(file, (p) => setUploadProgress(p));
      setStagedAttachment(attachmentObj);
    } catch (err) {
      alert(err.message || 'Failed to upload attachment');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowAttachmentMenu(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFileUpload(file);
  };

  // 5. Send Message Handler
  const handleSendMessage = (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText !== null ? customText : inputText;
    if (!textToSend.trim() && !stagedAttachment) return;

    const newMsg = sendChatMessage({
      conversationId: activeConversationId,
      text: textToSend.trim(),
      attachment: stagedAttachment,
      replyTo: replyTarget ? { id: replyTarget.id, text: replyTarget.text, senderName: replyTarget.senderName } : null
    });

    if (newMsg) {
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
      setStagedAttachment(null);
      setReplyTarget(null);
      scrollToBottom();
    }
  };

  // 6. Meeting Call Request Flow
  const handleConfirmStartMeeting = () => {
    const partner = activeConversation?.participant?.name || 'Peer';
    const newMsg = sendChatMessage({
      conversationId: activeConversationId,
      type: 'meeting_request',
      text: `📹 Aarav Shah invited ${partner} to join a live 1-on-1 video session.`,
      meetingRequest: {
        id: `mtg_${Date.now()}`,
        hostId: 'current_user',
        hostName: 'Aarav Shah',
        participantName: partner,
        participantAvatar: activeConversation?.participant?.avatar,
        status: 'pending',
        title: `1-on-1 Peer Session with ${partner}`
      }
    });

    if (newMsg) {
      setMessages(prev => [...prev, newMsg]);
      scrollToBottom();
      // Also trigger open meeting room for host
      setActiveMeetingObj({
        id: newMsg.meetingRequest.id,
        title: newMsg.meetingRequest.title,
        participantName: partner,
        participantAvatar: activeConversation?.participant?.avatar
      });
      setIsMeetingRoomOpen(true);
    }
  };

  const handleAcceptMeetingRequest = (msg) => {
    // Open meeting room for recipient
    setActiveMeetingObj({
      id: msg.meetingRequest?.id || `mtg_${Date.now()}`,
      title: msg.meetingRequest?.title || 'Peer Video Session',
      participantName: msg.senderName || 'Aarav Shah',
      participantAvatar: msg.avatar
    });
    setIsMeetingRoomOpen(true);
  };

  // 7. Peer Quiz Flow
  const handleShareQuizToChat = (quizData) => {
    const newMsg = sendChatMessage({
      conversationId: activeConversationId,
      type: 'peer_quiz',
      text: `🧠 Peer Quiz Challenge: ${quizData.quizTitle} (${quizData.score})`,
      peerQuiz: quizData
    });

    if (newMsg) {
      setMessages(prev => [...prev, newMsg]);
      scrollToBottom();
    }
  };

  // 8. Contextual Action Handlers
  const handleReact = (messageId, emoji) => {
    toggleMessageReaction(messageId, emoji);
    setMessages(getMessagesForConversation(activeConversationId));
  };

  const handlePin = (messageId) => {
    togglePinMessage(messageId);
    setMessages(getMessagesForConversation(activeConversationId));
  };

  const handleAskSage = (msg, mode = 'explain') => {
    setSageMessageTarget(msg);
    setSageMode(mode);
    setIsSageDrawerOpen(true);
  };

  const handleOpenMedia = (attachment) => {
    setActiveMediaAttachment(attachment);
    setIsMediaViewerOpen(true);
  };

  // Helper for Channel Icons
  const getChannelIcon = (name = '') => {
    if (name.includes('Code') || name.includes('Programming')) return <Code size={18} color={isLight ? '#0284c7' : '#06b6d4'} />;
    if (name.includes('Web')) return <Layout size={18} color={isLight ? '#0284c7' : '#38bdf8'} />;
    if (name.includes('AI')) return <Sparkles size={18} color="#a855f7" />;
    if (name.includes('UI/UX')) return <Sparkles size={18} color="#c084fc" />;
    if (name.includes('Data')) return <Database size={18} color="#d97706" />;
    if (name.includes('Exam')) return <Target size={18} color="#f43f5e" />;
    if (name.includes('Projects')) return <FolderGit2 size={18} color="#10b981" />;
    if (name.includes('Career')) return <Briefcase size={18} color="#3b82f6" />;
    return <Globe size={18} color={isLight ? '#64748b' : '#94a3b8'} />;
  };

  const pinnedMessages = messages.filter(m => m.isPinned);

  return (
    <div
      ref={chatContainerRef}
      className="edunova-chat-wrapper"
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        height: 'calc(100vh - 120px)',
        minHeight: '640px',
        maxHeight: '900px',
        borderRadius: '24px',
        background: isLight 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.90) 100%)' 
          : 'rgba(8, 12, 28, 0.95)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(6, 182, 212, 0.35)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: isLight ? '0 20px 60px rgba(64, 100, 160, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 1)' : '0 20px 60px rgba(0,0,0,0.7)',
        width: '100%',
        userSelect: isResizing ? 'none' : 'auto'
      }}
    >
      {/* DRAG AND DROP OVERLAY */}
      {isDragOver && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 500,
            background: isLight ? 'rgba(54, 199, 244, 0.15)' : 'rgba(6, 182, 212, 0.25)',
            backdropFilter: 'blur(12px)',
            border: isLight ? '3px dashed #36C7F4' : '3px dashed #06b6d4',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: isLight ? '#0f172a' : '#fff'
          }}
        >
          <Paperclip size={52} color="#0284c7" style={{ animation: 'bounce 1s infinite' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '12px' }}>Drop Files to Upload to Chat</h3>
          <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.9rem' }}>Supports Images, Videos, PDFs & Code documents</p>
        </div>
      )}

      {/* ----------------------------------------------------
          1. LEFT COLUMN: CONVERSATIONS & CHANNELS SIDEBAR
         ---------------------------------------------------- */}
      <div
        className={`chat-sidebar ${mobileView === 'chat' ? 'mobile-hidden' : ''}`}
        style={{
          width: `${sidebarWidth}px`,
          minWidth: `${sidebarWidth}px`,
          maxWidth: `${sidebarWidth}px`,
          borderRight: isLight ? '1px solid rgba(215, 228, 245, 0.85)' : '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          background: isLight ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 246, 255, 0.85) 100%)' : 'rgba(5, 8, 20, 0.98)',
          flexShrink: 0,
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Sidebar Header & Search */}
        <div style={{ padding: '16px', borderBottom: isLight ? '1px solid rgba(215, 228, 245, 0.85)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color={isLight ? '#0284c7' : '#06b6d4'} />
              Messages
            </h2>
            <span style={{ padding: '3px 9px', borderRadius: '12px', background: isLight ? 'rgba(54, 199, 244, 0.12)' : 'rgba(6, 182, 212, 0.15)', color: isLight ? '#0284c7' : '#38bdf8', border: isLight ? '1px solid rgba(54, 199, 244, 0.3)' : '1px solid rgba(6, 182, 212, 0.3)', fontSize: '0.72rem', fontWeight: 800 }}>
              Peer Network
            </span>
          </div>

          <div className="se-search-input-wrapper">
            <Search className="se-search-icon" style={{ width: '15px', height: '15px', color: isLight ? '#475569' : '#94a3b8' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, people, channels..."
              className="se-search-input"
              style={{
                padding: '8px 12px 8px 36px',
                fontSize: '0.82rem',
                background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(7, 11, 24, 0.6)',
                border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isLight ? '#0f172a' : '#fff'
              }}
            />
          </div>
        </div>

        {/* Filter Badges Bar */}
        <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 14px', gap: '6px', borderBottom: isLight ? '1px solid rgba(215, 228, 245, 0.85)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'exchange', label: 'Exchanges' },
            { id: 'community', label: 'Community' },
            { id: 'direct', label: 'Direct' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: isLight ? (filterType === f.id ? 'none' : '1px solid rgba(195, 215, 245, 0.85)') : 'none',
                cursor: 'pointer',
                background: filterType === f.id
                  ? 'linear-gradient(135deg, #0284c7, #6366f1)'
                  : (isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
                color: filterType === f.id ? '#fff' : (isLight ? '#475569' : '#94a3b8'),
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filteredConversations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: isLight ? '#475569' : '#94a3b8' }}>
              <MessageSquare size={32} color={isLight ? '#64748b' : '#64748b'} style={{ margin: '0 auto 8px auto' }} />
              <p style={{ fontSize: '0.85rem', margin: '0 0 12px 0' }}>
                No chats found for filter <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>"{filterType}"</strong>
              </p>
              <button
                onClick={() => { setFilterType('all'); setSearchQuery(''); }}
                className="se-btn se-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                Show All Chats
              </button>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isActive = c.id === activeConversationId;
              const isCommunity = c.type === 'community';

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConversationId(c.id);
                    setMobileView('chat');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '16px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: isActive
                      ? (isLight ? 'linear-gradient(135deg, rgba(54, 199, 244, 0.20), rgba(99, 102, 241, 0.16))' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.22), rgba(99, 102, 241, 0.22))')
                      : 'transparent',
                    border: isActive ? (isLight ? '1px solid rgba(54, 199, 244, 0.5)' : '1px solid rgba(6, 182, 212, 0.45)') : '1px solid transparent',
                    boxShadow: isActive ? (isLight ? '0 4px 16px rgba(54, 199, 244, 0.14)' : '0 4px 16px rgba(6, 182, 212, 0.15)') : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Avatar / Channel Icon */}
                  {isCommunity ? (
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.1)' }}>
                      {getChannelIcon(c.channelName)}
                    </div>
                  ) : (
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={c.participant?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                        alt={c.title}
                        style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', border: isLight ? '1.5px solid rgba(54, 199, 244, 0.5)' : '1px solid rgba(6, 182, 212, 0.3)' }}
                      />
                      {c.participant?.online && (
                        <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: isLight ? '2px solid #ffffff' : '2px solid #050814', boxShadow: '0 0 8px #22c55e' }} />
                      )}
                    </div>
                  )}

                  {/* Info Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.title || c.channelName}
                      </h4>
                      <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#64748b' }}>
                        {c.lastMessageTime}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: isLight ? '#475569' : '#94a3b8', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.lastMessage || c.description}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {c.unreadCount > 0 && (
                    <span style={{ padding: '2px 7px', borderRadius: '9999px', background: isLight ? '#0284c7' : '#06b6d4', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900 }}>
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dynamic Resize Handle Bar */}
      <div
        className="chat-sidebar-resizer"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
        title="Drag left/right to resize sidebar"
        style={{
          width: '6px',
          marginRight: '-3px',
          marginLeft: '-3px',
          cursor: 'col-resize',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          transition: 'background 0.2s ease',
          background: isResizing 
            ? (isLight ? '#0284c7' : '#06b6d4')
            : 'transparent'
        }}
      >
        <div
          style={{
            width: '2px',
            height: '32px',
            borderRadius: '2px',
            background: isResizing
              ? '#ffffff'
              : (isLight ? 'rgba(2, 132, 199, 0.35)' : 'rgba(255, 255, 255, 0.2)'),
            transition: 'background 0.2s ease'
          }}
        />
      </div>

      {/* ----------------------------------------------------
          2. CENTER COLUMN: MAIN CHAT STREAM & COMPOSER
         ---------------------------------------------------- */}
      <div
        className={`chat-main-area ${mobileView === 'sidebar' ? 'mobile-hidden' : ''}`}
        style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: isLight ? 'linear-gradient(180deg, rgba(245, 249, 255, 0.75) 0%, rgba(235, 243, 255, 0.70) 100%)' : '#050814', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
      >
        {/* Chat Header Bar */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: isLight ? '1px solid rgba(215, 228, 245, 0.85)' : '1px solid rgba(255, 255, 255, 0.12)',
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(12, 16, 36, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden', flex: 1 }}>
            {/* Mobile Back Button */}
            <button
              onClick={() => setMobileView('sidebar')}
              className="mobile-only-flex se-btn-icon"
              style={{ padding: '6px', background: isLight ? 'rgba(235, 243, 255, 0.8)' : 'rgba(255,255,255,0.08)', borderRadius: '8px', border: 'none', color: isLight ? '#0f172a' : '#fff', cursor: 'pointer', flexShrink: 0 }}
              title="Back to conversations list"
            >
              <ChevronLeft size={18} />
            </button>

            {activeConversation?.type !== 'community' && (
              <img
                src={activeConversation?.participant?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={activeConversation?.title}
                style={{ width: '38px', height: '38px', borderRadius: '12px', objectFit: 'cover', border: '1.5px solid #06b6d4', flexShrink: 0 }}
              />
            )}
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeConversation?.title || activeConversation?.channelName}
                </span>
                <span className="se-tag-cyan" style={{ padding: '2px 7px', fontSize: '0.65rem', flexShrink: 0 }}>
                  {activeConversation?.type === 'community' ? 'Community' : 'Exchange'}
                </span>
              </h3>

              {activeConversation?.participant ? (
                <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
                  Teaching: {activeConversation.participant.teaching || 'Skill'} ↔ Learning: {activeConversation.participant.learning || 'Skill'}
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', display: 'block', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeConversation?.description || 'General peer discussion channel'}
                </span>
              )}
            </div>
          </div>

          {/* Quick Header Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Call / Video Logo Button */}
            <button
              onClick={() => setIsMeetingRequestOpen(true)}
              className="se-btn se-btn-primary"
              style={{ padding: '6px 10px', fontSize: '0.75rem', background: 'linear-gradient(135deg, #06b6d4, #2563eb)', color: '#ffffff' }}
              title="Start Video Meeting / Join Session"
            >
              <Video size={14} /> Call
            </button>

            {/* Play Peer Quiz Button */}
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="se-btn se-btn-purple"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              title="Play Interactive Peer Quiz"
            >
              <HelpCircle size={14} /> Quiz
            </button>

            {onOpenScheduler && (
              <button
                onClick={() => onOpenScheduler(activeConversation?.participant)}
                className="se-btn se-btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              >
                <Calendar size={14} /> Schedule
              </button>
            )}

            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className="se-btn-icon"
              style={{ padding: '7px', background: showInfoPanel ? (isLight ? 'rgba(54, 199, 244, 0.18)' : 'rgba(6, 182, 212, 0.2)') : (isLight ? 'rgba(235, 243, 255, 0.8)' : 'rgba(255,255,255,0.08)'), borderRadius: '10px', border: showInfoPanel ? '1px solid #06b6d4' : 'none', color: isLight ? '#0f172a' : '#fff', cursor: 'pointer', flexShrink: 0 }}
              title="Toggle Workspace Info Panel"
            >
              <Users size={16} color={showInfoPanel ? (isLight ? '#0284c7' : '#38bdf8') : (isLight ? '#0f172a' : '#fff')} />
            </button>
          </div>
        </div>

        {/* Pinned Messages Banner */}
        {pinnedMessages.length > 0 && (
          <div style={{ padding: '8px 16px', background: isLight ? 'rgba(54, 199, 244, 0.12)' : 'rgba(6, 182, 212, 0.12)', borderBottom: isLight ? '1px solid rgba(54, 199, 244, 0.3)' : '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Pin size={14} color={isLight ? '#0284c7' : '#38bdf8'} /> Pinned Message: "{pinnedMessages[0].text}"
            </span>
            <span style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '0.72rem' }}>{pinnedMessages.length} pinned</span>
          </div>
        )}

        {/* Messages Feed */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 ? (
            /* EMPTY FEED STATE WITH SUGGESTIONS */
            <div style={{ textAlign: 'center', padding: '48px 24px', margin: 'auto 0', background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(12, 16, 36, 0.6)', borderRadius: '24px', border: isLight ? '1px solid rgba(215, 228, 245, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)' }}>
              <Bot size={48} color={isLight ? '#0284c7' : '#06b6d4'} style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                Welcome to {activeConversation?.title || activeConversation?.channelName || 'Chat'}!
              </h3>
              <p style={{ fontSize: '0.85rem', color: isLight ? '#475569' : '#94a3b8', maxWidth: '420px', margin: '6px auto 20px auto', lineHeight: 1.5 }}>
                This is the beginning of your peer discussion space. Share questions, play interactive quizzes, or start a video call.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                <button
                  onClick={() => setIsMeetingRequestOpen(true)}
                  className="se-btn se-btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', color: '#ffffff' }}
                >
                  <Video size={14} /> Start Video Meeting
                </button>
                <button
                  onClick={() => setIsQuizModalOpen(true)}
                  className="se-btn se-btn-purple"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  <HelpCircle size={14} /> Play Peer Quiz
                </button>
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === 'current_user';
              const hasReactions = m.reactions && Object.keys(m.reactions).length > 0;
              const isHovered = hoveredMessageId === m.id;
              const isMeetingReq = m.type === 'meeting_request' || m.meetingRequest;
              const isPeerQuiz = m.type === 'peer_quiz' || m.peerQuiz;

              return (
                <div
                  key={m.id}
                  onMouseEnter={() => setHoveredMessageId(m.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  {/* Contextual Actions Floating Toolbar */}
                  {isHovered && (
                    <MessageActionsMenu
                      message={m}
                      onReply={(msg) => setReplyTarget(msg)}
                      onReact={handleReact}
                      onPin={handlePin}
                      onAskSage={(msg) => handleAskSage(msg, 'explain')}
                      onSaveNote={(msg) => handleAskSage(msg, 'note')}
                      onCreateQuiz={(msg) => handleAskSage(msg, 'quiz')}
                      onAddToStudyPlan={(msg) => handleAskSage(msg, 'study_plan')}
                      onCopy={(text) => navigator.clipboard.writeText(text)}
                    />
                  )}

                  {/* Quoted Reply Preview Header */}
                  {m.replyTo && (
                    <div style={{ padding: '4px 10px', borderRadius: '8px', background: isLight ? 'rgba(235, 243, 255, 0.95)' : 'rgba(255,255,255,0.06)', borderLeft: '3px solid #06b6d4', fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', marginBottom: '4px' }}>
                      ↳ {m.replyTo.senderName}: "{m.replyTo.text}"
                    </div>
                  )}

                  {/* Sender Name */}
                  {!isMe && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', marginBottom: '2px', padding: '0 4px' }}>
                      {m.senderName}
                    </span>
                  )}

                  {/* -----------------------------------------------------
                      1. SPECIAL CARD: MEETING REQUEST INVITATION CARD
                     ----------------------------------------------------- */}
                  {isMeetingReq ? (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '20px',
                        background: isLight ? 'linear-gradient(135deg, rgba(240, 249, 255, 0.98), rgba(235, 243, 255, 0.98))' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(37, 99, 235, 0.25))',
                        border: isLight ? '1.5px solid rgba(54, 199, 244, 0.6)' : '1.5px solid #06b6d4',
                        boxShadow: isLight ? '0 8px 25px rgba(54, 199, 244, 0.15)' : '0 8px 25px rgba(6, 182, 212, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '280px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', borderRadius: '12px', background: '#06b6d4', color: '#ffffff' }}>
                          <Video size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                            Live 1-on-1 Video Meeting Invitation
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: isLight ? '#0284c7' : '#38bdf8' }}>
                            Host: {m.meetingRequest?.hostName || m.senderName}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#e2e8f0', margin: 0, lineHeight: 1.4 }}>
                        {m.text}
                      </p>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          onClick={() => handleAcceptMeetingRequest(m)}
                          className="se-btn se-btn-primary"
                          style={{ flex: 1, padding: '8px 14px', fontSize: '0.8rem', justifyContent: 'center', color: '#ffffff' }}
                        >
                          <Video size={14} /> Accept & Join Meeting
                        </button>
                      </div>
                    </div>
                  ) : isPeerQuiz ? (
                    /* -----------------------------------------------------
                       2. SPECIAL CARD: PEER QUIZ CHALLENGE CARD
                       ----------------------------------------------------- */
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '20px',
                        background: isLight ? 'linear-gradient(135deg, rgba(250, 245, 255, 0.98), rgba(240, 245, 255, 0.98))' : 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(99, 102, 241, 0.25))',
                        border: isLight ? '1.5px solid rgba(168, 85, 247, 0.6)' : '1.5px solid #c084fc',
                        boxShadow: isLight ? '0 8px 25px rgba(168, 85, 247, 0.15)' : '0 8px 25px rgba(168, 85, 247, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '280px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', borderRadius: '12px', background: '#a855f7', color: '#fff' }}>
                          <HelpCircle size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                            {m.peerQuiz?.quizTitle || 'Peer Learning Quiz Challenge'}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: isLight ? '#7e22ce' : '#c084fc' }}>
                            Score / Challenge Shared
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#e2e8f0', margin: 0 }}>
                        {m.text}
                      </p>

                      <button
                        onClick={() => setIsQuizModalOpen(true)}
                        className="se-btn se-btn-purple"
                        style={{ padding: '8px 14px', fontSize: '0.8rem', justifyContent: 'center' }}
                      >
                        <Play size={14} /> Play Quiz Challenge 🎮
                      </button>
                    </div>
                  ) : (
                    /* STANDARD MESSAGE BUBBLE */
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMe
                          ? 'linear-gradient(135deg, #0284c7, #6366f1)'
                          : (isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(12, 16, 36, 0.95)'),
                        border: isMe ? 'none' : (isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.14)'),
                        color: isMe ? '#ffffff' : (isLight ? '#0f172a' : '#e2e8f0'),
                        fontSize: '0.88rem',
                        fontWeight: isMe ? 500 : (isLight ? 600 : 400),
                        lineHeight: 1.5,
                        boxShadow: isLight ? '0 4px 18px rgba(64, 100, 160, 0.08)' : '0 4px 18px rgba(0,0,0,0.35)'
                      }}
                    >
                      {m.text && <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: isMe ? '#ffffff' : (isLight ? '#0f172a' : '#e2e8f0') }}>{m.text}</p>}

                      {/* Attachment Preview Card */}
                      {m.attachment && (
                        <div
                          onClick={() => handleOpenMedia(m.attachment)}
                          style={{
                            marginTop: m.text ? '8px' : '0',
                            padding: m.attachment.type === 'image' ? '4px' : '10px 14px',
                            borderRadius: '14px',
                            background: isLight ? 'rgba(240, 246, 255, 0.95)' : 'rgba(0,0,0,0.35)',
                            border: isLight ? '1px solid rgba(200, 215, 240, 0.95)' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: m.attachment.type === 'image' ? 'column' : 'row',
                            alignItems: m.attachment.type === 'image' ? 'stretch' : 'center',
                            gap: '10px',
                            overflow: 'hidden'
                          }}
                        >
                          {m.attachment.type === 'image' ? (
                            <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '10px' }}>
                              <img
                                src={m.attachment.thumbnailUrl || m.attachment.url}
                                alt={m.attachment.name}
                                style={{
                                  width: '100%',
                                  maxHeight: '280px',
                                  objectFit: 'cover',
                                  display: 'block',
                                  borderRadius: '10px',
                                  transition: 'transform 0.2s ease'
                                }}
                              />
                              <div style={{ position: 'absolute', bottom: '6px', right: '6px', padding: '4px 8px', borderRadius: '8px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                                {m.attachment.name} ({m.attachment.size})
                              </div>
                            </div>
                          ) : (
                            <>
                              {m.attachment.type === 'video' && <Video size={24} color="#0284c7" />}
                              {m.attachment.type === 'pdf' && <FileText size={24} color="#f43f5e" />}
                              {m.attachment.type !== 'video' && m.attachment.type !== 'pdf' && <FileText size={24} color="#a855f7" />}
                              <div>
                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', display: 'block' }}>{m.attachment.name}</span>
                                <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8' }}>{m.attachment.size} • Click to open</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reactions Counter Bar */}
                  {hasReactions && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {Object.entries(m.reactions).map(([emoji, count]) => (
                        <span key={emoji} style={{ padding: '2px 6px', borderRadius: '10px', background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.08)', fontSize: '0.72rem', color: isLight ? '#0f172a' : '#cbd5e1', border: isLight ? '1px solid rgba(200, 215, 240, 0.9)' : '1px solid rgba(255,255,255,0.12)' }}>
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '0.68rem', color: isLight ? '#475569' : '#64748b', marginTop: '3px', padding: '0 4px' }}>
                    {m.timestamp}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Target Banner */}
        {replyTarget && (
          <div style={{ padding: '8px 16px', background: isLight ? 'rgba(54, 199, 244, 0.15)' : 'rgba(6, 182, 212, 0.15)', borderTop: isLight ? '1px solid rgba(54, 199, 244, 0.3)' : '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 600 }}>
              Replying to <strong>{replyTarget.senderName}</strong>: "{replyTarget.text}"
            </span>
            <button onClick={() => setReplyTarget(null)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Staged Attachment Preview Banner */}
        {stagedAttachment && (
          <div style={{ padding: '10px 16px', background: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(12, 16, 36, 0.98)', borderTop: isLight ? '1px solid rgba(54, 199, 244, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {stagedAttachment.type === 'image' && stagedAttachment.url ? (
                <img src={stagedAttachment.url} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #06b6d4' }} />
              ) : (
                <Paperclip size={18} color={isLight ? '#0284c7' : '#38bdf8'} />
              )}
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', display: 'block' }}>{stagedAttachment.name}</span>
                <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8' }}>Ready to send • {stagedAttachment.size}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={(e) => handleSendMessage(e)}
                className="se-btn se-btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem', color: '#ffffff' }}
              >
                <Send size={13} /> Send Attachment
              </button>
              <button onClick={() => setStagedAttachment(null)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Interactive Chat Composer Bar */}
        <div style={{ padding: '16px', borderTop: isLight ? '1px solid rgba(215, 228, 245, 0.85)' : '1px solid rgba(255, 255, 255, 0.12)', background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(12, 16, 36, 0.95)' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Attachment Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="se-btn-icon"
                style={{ padding: '10px', background: isLight ? 'rgba(235, 243, 255, 0.95)' : 'rgba(255,255,255,0.08)', borderRadius: '12px', border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : 'none', color: isLight ? '#0284c7' : '#38bdf8', cursor: 'pointer' }}
                title="Attach file, photo or document"
              >
                <Plus size={18} />
              </button>

              {/* Attachment Dropdown Popup Menu */}
              {showAttachmentMenu && (
                <div style={{ position: 'absolute', bottom: '50px', left: 0, width: '200px', background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(8, 12, 28, 0.98)', border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(6, 182, 212, 0.4)', borderRadius: '16px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: isLight ? '0 10px 30px rgba(64, 100, 160, 0.18)' : '0 10px 30px rgba(0,0,0,0.7)', zIndex: 100 }}>
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: isLight ? '#0f172a' : '#fff', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <ImageIcon size={15} color="#0284c7" /> Photo / Video
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: isLight ? '#0f172a' : '#fff', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <FileText size={15} color="#c084fc" /> Document PDF
                  </button>
                  <button type="button" onClick={() => { setShowAttachmentMenu(false); setIsQuizModalOpen(true); }} style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: isLight ? '#0f172a' : '#fff', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <HelpCircle size={15} color="#d97706" /> Play Peer Quiz 🧠
                  </button>
                  <button type="button" onClick={() => { setShowAttachmentMenu(false); setIsMeetingRequestOpen(true); }} style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: isLight ? '#0f172a' : '#fff', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <Video size={15} color="#10b981" /> Start Video Meeting 📹
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConversation?.title || activeConversation?.channelName || 'peer'}...`}
              className="se-form-input"
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '0.88rem',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(255, 255, 255, 0.14)',
                color: isLight ? '#0f172a' : '#ffffff'
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !stagedAttachment}
              className="se-btn se-btn-primary"
              style={{ padding: '12px 20px', borderRadius: '14px', opacity: (inputText.trim() || stagedAttachment) ? 1 : 0.5, color: '#ffffff' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ----------------------------------------------------
          3. RIGHT COLUMN: EXCHANGE & PARTICIPANTS INFO PANEL
         ---------------------------------------------------- */}
      {showInfoPanel && (
        <div
          className="chat-info-panel"
          style={{
            width: '230px',
            minWidth: '200px',
            maxWidth: '230px',
            borderLeft: isLight ? '1px solid rgba(215, 228, 245, 0.85)' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '14px 12px',
            background: isLight ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 246, 255, 0.85) 100%)' : 'rgba(5, 8, 20, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto',
            overflowX: 'hidden',
            flexShrink: 0,
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Workspace Info
            </h4>
            <button onClick={() => setShowInfoPanel(false)} style={{ background: 'none', border: 'none', color: isLight ? '#475569' : '#94a3b8', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>

          {/* Participant Profile Card */}
          {activeConversation?.participant && (
            <div style={{ padding: '12px 10px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255,255,255,0.1)', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
              <img
                src={activeConversation.participant.avatar}
                alt={activeConversation.participant.name}
                style={{ width: '52px', height: '52px', borderRadius: '16px', objectFit: 'cover', margin: '0 auto 8px auto', border: '2px solid #06b6d4' }}
              />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeConversation.participant.name}
              </h4>
              <p style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', margin: '2px 0 10px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeConversation.participant.title}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                <button
                  onClick={() => setIsMeetingRequestOpen(true)}
                  className="se-btn se-btn-primary"
                  style={{ padding: '7px 8px', fontSize: '0.75rem', justifyContent: 'center', width: '100%', boxSizing: 'border-box', whiteSpace: 'nowrap', color: '#ffffff' }}
                >
                  <Video size={13} /> Video Call
                </button>
                <button
                  onClick={() => setIsQuizModalOpen(true)}
                  className="se-btn se-btn-purple"
                  style={{ padding: '7px 8px', fontSize: '0.75rem', justifyContent: 'center', width: '100%', boxSizing: 'border-box', whiteSpace: 'nowrap' }}
                >
                  <HelpCircle size={13} /> Peer Quiz
                </button>
              </div>
            </div>
          )}

          {/* Shared Goals Summary */}
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Exchange Goals (2/4)
            </h5>
            <div style={{ padding: '10px 12px', borderRadius: '12px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255,255,255,0.1)', fontSize: '0.74rem', color: isLight ? '#0f172a' : '#cbd5e1', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '8px', lineHeight: 1.35 }}>
                <CheckCircle size={14} color={isLight ? '#0284c7' : '#38bdf8'} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', fontWeight: isLight ? 600 : 400 }}>Understand useState & Hooks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.35 }}>
                <Clock size={14} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', fontWeight: isLight ? 600 : 400 }}>Implement Context API State</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <MediaViewerModal
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
        attachment={activeMediaAttachment}
      />

      <SageChatAssistantDrawer
        isOpen={isSageDrawerOpen}
        onClose={() => setIsSageDrawerOpen(false)}
        message={sageMessageTarget}
        mode={sageMode}
      />

      <ExchangeSessionModeModal
        isOpen={isSessionModeOpen}
        onClose={() => setIsSessionModeOpen(false)}
        conversation={activeConversation}
      />

      <PeerQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        partnerName={activeConversation?.participant?.name || 'Peer'}
        onShareQuizToChat={handleShareQuizToChat}
      />

      <MeetingRequestModal
        isOpen={isMeetingRequestOpen}
        onClose={() => setIsMeetingRequestOpen(false)}
        partnerName={activeConversation?.participant?.name || 'Peer'}
        onConfirmStartMeeting={handleConfirmStartMeeting}
      />

      {activeMeetingObj && (
        <MeetingRoomModal
          isOpen={isMeetingRoomOpen}
          onClose={() => setIsMeetingRoomOpen(false)}
          meeting={activeMeetingObj}
        />
      )}
    </div>
  );
};

export default ChatPage;
