import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'cyan', 'purple', 'outline', 'ghost', 'danger'
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  style = {},
  type = 'button'
}) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: isLight ? '#2563eb' : '#2563eb',
          color: '#ffffff',
          fontWeight: 600,
          boxShadow: isLight
            ? '0 2px 8px rgba(37, 99, 235, 0.22)'
            : '0 4px 14px rgba(37, 99, 235, 0.35)',
          border: 'none'
        };
      case 'secondary':
        return {
          background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
          color: isLight ? '#334155' : 'var(--text-primary)',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: isLight ? '0 1px 3px rgba(0, 0, 0, 0.04)' : 'none'
        };
      case 'cyan':
        return {
          background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(34, 211, 238, 0.15)',
          color: isLight ? '#0284c7' : '#22d3ee',
          border: isLight ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid rgba(34, 211, 238, 0.35)',
          boxShadow: isLight ? '0 2px 6px rgba(2, 132, 199, 0.1)' : '0 4px 20px rgba(34, 211, 238, 0.2)'
        };
      case 'purple':
        return {
          background: isLight ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139, 92, 246, 0.15)',
          color: isLight ? '#7c3aed' : '#c084fc',
          border: isLight ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid rgba(139, 92, 246, 0.35)',
          boxShadow: isLight ? '0 2px 6px rgba(124, 58, 237, 0.1)' : '0 4px 20px rgba(139, 92, 246, 0.2)'
        };
      case 'outline':
        return {
          background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
          color: isLight ? '#334155' : 'var(--text-primary)',
          border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-glow)',
          boxShadow: isLight ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: isLight ? '#475569' : 'var(--text-secondary)',
          border: 'none'
        };
      case 'danger':
        return {
          background: isLight ? 'rgba(225, 29, 72, 0.1)' : 'rgba(244, 63, 94, 0.15)',
          color: isLight ? '#e11d48' : '#fb7185',
          border: isLight ? '1px solid rgba(225, 29, 72, 0.25)' : '1px solid rgba(244, 63, 94, 0.35)',
          boxShadow: 'none'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { padding: '7px 14px', fontSize: '0.82rem', borderRadius: '10px' };
      case 'lg': return { padding: '12px 24px', fontSize: '0.95rem', borderRadius: '12px' };
      default: return { padding: '9px 18px', fontSize: '0.88rem', borderRadius: '10px' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        fontWeight: 600,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
    >
      {children}
    </button>
  );
};

export default Button;

