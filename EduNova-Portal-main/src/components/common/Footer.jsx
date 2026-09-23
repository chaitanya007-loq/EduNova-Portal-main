import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 0 20px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img
                src="/edunova_icon.png"
                alt="EduNova 3D Icon"
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))'
                }}
              />
              <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }} className="gradient-text-animated">EduNova</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Learn Beyond Boundaries. AI-powered immersive education, browser XR simulations, and peer skill barter platform.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Ecosystem</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Link to="/immersive-lab">Immersive Lab</Link>
              <Link to="/xr-studio">XR Studio</Link>
              <Link to="/constellation">Knowledge Constellation</Link>
              <Link to="/skill-dna">Skill DNA</Link>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '30px' }}>
              <Link to="/skill-marketplace">Skill Barter Exchange</Link>
              <Link to="/ai-assistant">Sage AI Assistant</Link>
              <Link to="/community">Community Q&A</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Platform Security</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#10b981" /> Firebase-Ready Service Layer
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span>© 2026 EduNova Platform Inc. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for the Future of Education.
          </span>
        </div>
      </div>
    </footer>
  );
};
