import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BackgroundParticles } from '../common/BackgroundParticles';

export const AuthLayout = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div
      className="edunova-auth-page"
      data-theme="dark"
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, #151c3a 0%, #080c1e 60%, #050714 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        padding: '32px 16px',
        boxSizing: 'border-box'
      }}
    >
      <BackgroundParticles />

      {/* Atmospheric Ambient Radial Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(52, 211, 153, 0.1) 50%, transparent 70%)',
        filter: 'blur(110px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{ width: '100%', maxWidth: '520px', margin: 'auto 0', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(168, 85, 247, 0.3))',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
            }}>
              <img
                src="/edunova_icon.png"
                alt="EduNova Icon"
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.8))'
                }}
              />
            </div>
            <span style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }} className="gradient-text-animated">
              EduNova
            </span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

