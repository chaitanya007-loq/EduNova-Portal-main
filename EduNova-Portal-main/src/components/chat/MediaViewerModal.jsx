import React from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

export const MediaViewerModal = ({ isOpen, onClose, attachment }) => {
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  if (!isOpen || !attachment) return null;

  const isImage = attachment.type === 'image' || attachment.mimeType?.startsWith('image/');
  const isVideo = attachment.type === 'video' || attachment.mimeType?.startsWith('video/');
  const isPdf = attachment.type === 'pdf' || attachment.mimeType === 'application/pdf';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(3, 7, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Modal Top Controls Bar */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(12, 16, 36, 0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {attachment.name}
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            ({attachment.size})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isImage && (
            <>
              <button
                onClick={() => setScale(prev => Math.min(prev + 0.25, 3))}
                className="se-btn-icon"
                style={{ padding: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setScale(prev => Math.max(prev - 0.25, 0.5))}
                className="se-btn-icon"
                style={{ padding: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="se-btn-icon"
                style={{ padding: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                title="Rotate"
              >
                <RotateCw size={18} />
              </button>
            </>
          )}

          <a
            href={attachment.url}
            download={attachment.name}
            className="se-btn se-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} /> Download
          </a>

          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content View Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflow: 'auto'
        }}
      >
        {isImage && (
          <img
            src={attachment.url}
            alt={attachment.name}
            style={{
              maxHeight: '82vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              borderRadius: '12px',
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
          />
        )}

        {isVideo && (
          <video
            controls
            autoPlay
            src={attachment.url}
            style={{
              maxHeight: '80vh',
              maxWidth: '90vw',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
          />
        )}

        {isPdf && (
          <iframe
            src={attachment.url}
            title={attachment.name}
            style={{
              width: '90vw',
              height: '82vh',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          />
        )}

        {!isImage && !isVideo && !isPdf && (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(12, 16, 36, 0.9)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.14)' }}>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '12px' }}>{attachment.name}</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Preview not available for this file type.</p>
            <a href={attachment.url} download={attachment.name} className="se-btn se-btn-primary">
              Download File ({attachment.size})
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
