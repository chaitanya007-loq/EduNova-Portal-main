import React, { useEffect, useState, useRef } from 'react';

// Official Google 'G' multicolored SVG icon
export const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const DEFAULT_CLIENT_ID = '526721686264-ofhn2er026eej43ee4arn43mntl0h9dr.apps.googleusercontent.com';

export const GoogleAuthButton = ({
  onSuccess,
  onError,
  loading = false,
  text = 'Continue with Google',
}) => {
  const [isGoogleRendered, setIsGoogleRendered] = useState(false);
  const buttonRef = useRef(null);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID;

  useEffect(() => {
    const initGis = () => {
      if (window.google?.accounts?.id && buttonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (response.credential) {
                onSuccess(response.credential);
              } else {
                onError?.(new Error('No credential returned by Google'));
              }
            },
          });

          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            text: text.includes('Sign Up') ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
          });
          setIsGoogleRendered(true);
        } catch (err) {
          console.warn('Failed to initialize Google Sign-In:', err);
        }
      }
    };

    // Load Google script dynamically if not present
    if (!window.google?.accounts?.id) {
      const existingScript = document.getElementById('google-gsi-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initGis();
        };
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(interval);
            initGis();
          }
        }, 150);
        return () => clearInterval(interval);
      }
    } else {
      initGis();
    }
  }, [clientId, text, onSuccess, onError]);

  const handleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      onError?.(new Error('Google services are still initializing. Please click again in a second.'));
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '44px', display: 'flex', justifyContent: 'center' }}>
      {/* Container for official Google GIS button */}
      <div
        ref={buttonRef}
        style={{
          width: '100%',
          display: isGoogleRendered ? 'flex' : 'none',
          justifyContent: 'center',
        }}
      />

      {/* Fallback button shown while Google script is initializing */}
      {!isGoogleRendered && (
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md, 10px)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--text-primary, #ffffff)',
            fontSize: '0.92rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <GoogleIcon size={19} />
          <span>{loading ? 'Connecting to Google...' : text}</span>
        </button>
      )}
    </div>
  );
};
