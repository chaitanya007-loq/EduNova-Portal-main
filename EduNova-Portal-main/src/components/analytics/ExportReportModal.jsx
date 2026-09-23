import React, { useState } from 'react';
import { Download, X, Lock, FileText, Table } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { useTheme } from '../../context/ThemeContext';

export const ExportReportModal = ({ isOpen, onClose, analyticsData }) => {
  const [format, setFormat] = useState('pdf');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const handleDownload = () => {
    analyticsService.exportReport(format, analyticsData);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: '24px',
        background: isLight 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(240, 246, 255, 0.94))'
          : '#0c1024',
        border: isLight ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
        boxShadow: isLight ? '0 20px 50px rgba(0, 0, 0, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.7)',
        padding: '24px',
        color: isLight ? '#18345F' : '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} color="#06b6d4" /> Export Analytics Report
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: isLight ? '#475569' : '#94a3b8', margin: '0 0 16px 0' }}>
          Generate a comprehensive summary of study hours, subject performance, accuracy trends, and weak topics.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setFormat('pdf')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              background: format === 'pdf' ? (isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.2)') : (isLight ? 'rgba(255, 255, 255, 0.7)' : '#050814'),
              border: format === 'pdf' ? '1.5px solid #06b6d4' : (isLight ? '1px solid rgba(203, 213, 225, 0.6)' : '1px solid rgba(255,255,255,0.1)'),
              color: isLight ? '#18345F' : '#fff',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={22} color="#06b6d4" /> Report File (.TXT/PDF)
          </button>
          <button
            onClick={() => setFormat('csv')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              background: format === 'csv' ? (isLight ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.2)') : (isLight ? 'rgba(255, 255, 255, 0.7)' : '#050814'),
              border: format === 'csv' ? '1.5px solid #6366f1' : (isLight ? '1px solid rgba(203, 213, 225, 0.6)' : '1px solid rgba(255,255,255,0.1)'),
              color: isLight ? '#18345F' : '#fff',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Table size={22} color="#6366f1" /> CSV Spreadsheets
          </button>
        </div>

        <button onClick={handleDownload} className="se-btn se-btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
          <Download size={16} /> Download {format.toUpperCase()} Report
        </button>
      </div>
    </div>
  );
};

export const AnalyticsPrivacyModal = ({ isOpen, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState(true);
  const [shareProgress, setShareProgress] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: '24px',
        background: isLight 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(240, 246, 255, 0.94))'
          : '#0c1024',
        border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: isLight ? '0 20px 50px rgba(0, 0, 0, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.7)',
        padding: '24px',
        color: isLight ? '#18345F' : '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="#06b6d4" /> Analytics Privacy & Data Controls
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '16px 0 20px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem' }}>
            <span>Allow Sage AI Diagnostic Analysis</span>
            <input type="checkbox" checked={aiAnalysis} onChange={(e) => setAiAnalysis(e.target.checked)} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem' }}>
            <span>Share Leaderboard & Peer Progress</span>
            <input type="checkbox" checked={shareProgress} onChange={(e) => setShareProgress(e.target.checked)} />
          </label>
        </div>

        <button onClick={onClose} className="se-btn se-btn-secondary" style={{ width: '100%', padding: '10px', justifyContent: 'center' }}>
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
};
