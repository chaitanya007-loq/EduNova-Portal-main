import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CANDIDATE_HEALTH_URLS = [
  process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/health` : null,
  'http://localhost:5000/api/health',
  'http://localhost:5001/api/health'
].filter(Boolean);

const IS_DEV = process.env.NODE_ENV !== 'production';

export const ServerUnavailableBanner = () => {
  const { hydrateSession } = useAuth() || {};
  const [isOffline, setIsOffline] = useState(false);
  const [checking, setChecking] = useState(false);
  const [retrySuccess, setRetrySuccess] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const checkServerHealth = useCallback(async () => {
    for (const healthUrl of CANDIDATE_HEALTH_URLS) {
      try {
        const res = await fetch(healthUrl, { method: 'GET', credentials: 'include' });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.success) {
            setIsOffline(false);
            setDismissed(false);
            return true;
          }
        }
      } catch {
        // Try next candidate URL
      }
    }
    setIsOffline(true);
    return false;
  }, []);

  useEffect(() => {
    const handleNetworkError = () => {
      setIsOffline(true);
    };
    window.addEventListener('edunova:network-error', handleNetworkError);

    // Initial silent check
    checkServerHealth();

    return () => {
      window.removeEventListener('edunova:network-error', handleNetworkError);
    };
  }, [checkServerHealth]);

  const handleRetry = async () => {
    setChecking(true);
    setRetrySuccess(false);

    const healthy = await checkServerHealth();
    if (healthy) {
      setRetrySuccess(true);
      if (hydrateSession) {
        await hydrateSession();
      }
      setTimeout(() => {
        setRetrySuccess(false);
      }, 2000);
    }

    setChecking(false);
  };

  if (dismissed || (!isOffline && !retrySuccess)) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999999,
        width: '90%',
        maxWidth: '560px',
        background: isOffline
          ? 'rgba(30, 15, 25, 0.95)'
          : 'rgba(15, 35, 25, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isOffline
          ? '1px solid rgba(244, 63, 94, 0.4)'
          : '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '16px',
        padding: '14px 18px',
        color: '#ffffff',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), 0 0 20px rgba(244, 63, 94, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isOffline ? (
            <AlertTriangle size={20} color="#fb7185" />
          ) : (
            <CheckCircle2 size={20} color="#34d399" />
          )}
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
            {isOffline ? 'EduNova server is currently unavailable.' : 'Connected to EduNova API!'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOffline && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={checking}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'var(--accent-rose, #f43f5e)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: checking ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={14} className={checking ? 'spin-animation' : ''} />
              {checking ? 'Checking...' : 'Retry Connection'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {isOffline && IS_DEV && (
        <div
          style={{
            fontSize: '0.76rem',
            color: 'rgba(255, 255, 255, 0.65)',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Development details: <strong>API: http://localhost:5000/api</strong></span>
          <span style={{ color: '#fb7185' }}>Status: Offline</span>
        </div>
      )}
    </div>
  );
};

export default ServerUnavailableBanner;
