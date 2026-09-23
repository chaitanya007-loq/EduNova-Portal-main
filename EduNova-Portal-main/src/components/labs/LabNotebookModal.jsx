import React from 'react';
import { X, BookOpen, Download, FileText, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';
import { getLabAttempts } from '../../services/labProgressService';
import { generateLabReport, exportReportAsMarkdown } from '../../services/labReportService';
import { getLabById } from '../../services/labService';

export const LabNotebookModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const attempts = getLabAttempts();

  const handleExport = (attempt) => {
    const lab = getLabById(attempt.labId);
    const report = generateLabReport({
      lab,
      parameters: attempt.parameters,
      prediction: 'Verified parameter relationships during live simulation execution.',
      results: attempt.results,
      studentName: 'EduNova Student',
      notes: attempt.notes
    });

    exportReportAsMarkdown(report);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '85vh',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0b112c 0%, #050814 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 30px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Labs
            </button>
            <div
              style={{
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#38bdf8'
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Digital Practical Lab Notebook
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
                Recorded experiment logs, parameters, observations & Sage AI practical reports
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Notebook Entries Body */}
        <div
          style={{
            flex: 1,
            padding: '24px 30px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {attempts.length > 0 ? (
            attempts.map((att) => (
              <div
                key={att.id}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    {att.subject}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <Calendar size={14} />
                    {new Date(att.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>
                    {att.labTitle}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>
                    Parameters Recorded: {JSON.stringify(att.parameters)}
                  </p>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(8, 13, 36, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.82rem',
                    color: '#cbd5e1'
                  }}
                >
                  <strong style={{ color: '#38bdf8' }}>Observed Output:</strong> {JSON.stringify(att.results)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleExport(att)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: '#38bdf8',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} /> Export Lab Report (.md)
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <FileText size={42} color="#64748b" />
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>No experiment records yet</h3>
              <p style={{ margin: 0, fontSize: '0.86rem' }}>
                Run an interactive simulation and click "Record Results" to save entry into your digital notebook.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabNotebookModal;
