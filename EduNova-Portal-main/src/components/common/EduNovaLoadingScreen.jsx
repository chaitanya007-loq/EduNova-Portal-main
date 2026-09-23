import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
  'Negotiating with the Wi-Fi… 📶',
  'Summoning Sage AI Tutor… 🤖',
  'Aligning Quantum 3D Spatial Mesh… 🌌',
  'Loading personalized academic workspace… ⚡',
  'Syncing progress telemetry… 📊'
];

export const EduNovaLoadingScreen = ({
  fullScreen = true,
  message = 'Negotiating with the Wi-Fi… 📶',
  minHeight = '400px'
}) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const currentDisplayMessage = msgIndex === 0 ? message : LOADING_MESSAGES[msgIndex];

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '32px 24px',
        textAlign: 'center',
        zIndex: 99999,
        position: 'relative'
      }}
    >
      {/* 3D Animated Logo Container */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer Pulsing Neon Aura Ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.85, 0.4],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.6), rgba(168, 85, 247, 0.6), rgba(52, 211, 153, 0.6), rgba(56, 189, 248, 0.6))',
            filter: 'blur(22px)',
            pointerEvents: 'none'
          }}
        />

        {/* Floating Glass Emblem Holder */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotateZ: [0, 1.5, -1.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '26px',
            background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 30, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(56, 189, 248, 0.4), inset 0 1.5px 2px rgba(255, 255, 255, 0.4)',
            position: 'relative',
            zIndex: 2,
            overflow: 'hidden'
          }}
        >
          <img
            src="/edunova_logo_3d.png"
            alt="EduNova 3D Logo"
            style={{
              width: '82px',
              height: '82px',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.9))'
            }}
          />
        </motion.div>
      </div>

      {/* Clean Animated Loading Text */}
      <div style={{ maxWidth: '420px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDisplayMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
              textShadow: '0 2px 12px rgba(56, 189, 248, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)'
            }}>
              {currentDisplayMessage}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="edunova-loading-screen"
        data-theme="dark"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'radial-gradient(ellipse at 50% 0%, #151c3a 0%, #080c1e 60%, #050714 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Background Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }} />
        {content}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {content}
    </div>
  );
};

export default EduNovaLoadingScreen;
