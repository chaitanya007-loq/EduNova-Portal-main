import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Mic, Radio, Music, Disc } from 'lucide-react';
import { Button } from '../common/Button';

export const AIVoiceSoundscapeWidget = () => {
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [soundscapeMode, setSoundscapeMode] = useState('synthwave'); // synthwave, rain, binaural
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Stop web audio on unmount
  useEffect(() => {
    return () => {
      stopSoundscape();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Audio API ambient synthwave soundscape generator
  const startSoundscape = (type) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      stopSoundscape();

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soundscape tone settings
      if (type === 'synthwave') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
      } else if (type === 'binaural') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(216, ctx.currentTime); // 216Hz focus frequency
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(146.8, ctx.currentTime); // D3 soft chord
      }

      gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlayingSoundscape(true);
      setSoundscapeMode(type);
    } catch (e) {
      console.warn('Web Audio synthesis not supported or blocked:', e);
    }
  };

  const stopSoundscape = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    setIsPlayingSoundscape(false);
  };

  const toggleSoundscape = (type) => {
    if (isPlayingSoundscape && soundscapeMode === type) {
      stopSoundscape();
    } else {
      startSoundscape(type);
    }
  };

  // Browser Speech Synthesis for Sage AI Audio Recitation
  const speakDailyBriefing = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = "Welcome to your EduNova command center! Today's AI focus recommendation: Explore Asynchronous State Management and test your skills in the 3D Mechanical Engine Lab. You have earned a 1.5x XP multiplier!";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{
      background: 'rgba(12, 16, 36, 0.92)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(6, 182, 212, 0.35)',
      padding: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.4)'
          }}>
            <Radio size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: 0 }}>Focus Soundscape & AI Voice</h3>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Spatial Audio Companion</span>
          </div>
        </div>

        {/* Live Audio Equalizer Waveform */}
        {isPlayingSoundscape && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
            <div style={{ width: '3px', height: '100%', background: '#06b6d4', animation: 'bounce 0.6s infinite alternate' }} />
            <div style={{ width: '3px', height: '60%', background: '#a855f7', animation: 'bounce 0.8s infinite alternate' }} />
            <div style={{ width: '3px', height: '80%', background: '#38bdf8', animation: 'bounce 0.5s infinite alternate' }} />
            <div style={{ width: '3px', height: '40%', background: '#34d399', animation: 'bounce 0.7s infinite alternate' }} />
          </div>
        )}
      </div>

      {/* Soundscape Mode Selector Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={() => toggleSoundscape('synthwave')}
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: isPlayingSoundscape && soundscapeMode === 'synthwave' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(99, 102, 241, 0.3))' : 'rgba(15, 23, 42, 0.7)',
            border: isPlayingSoundscape && soundscapeMode === 'synthwave' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Music size={14} color="#06b6d4" /> Synth Focus
        </button>

        <button
          onClick={() => toggleSoundscape('binaural')}
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: isPlayingSoundscape && soundscapeMode === 'binaural' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3))' : 'rgba(15, 23, 42, 0.7)',
            border: isPlayingSoundscape && soundscapeMode === 'binaural' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Disc size={14} color="#a855f7" /> 432Hz Beats
        </button>

        <button
          onClick={() => toggleSoundscape('rain')}
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: isPlayingSoundscape && soundscapeMode === 'rain' ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(6, 182, 212, 0.3))' : 'rgba(15, 23, 42, 0.7)',
            border: isPlayingSoundscape && soundscapeMode === 'rain' ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Radio size={14} color="#34d399" /> Deep Ambient
        </button>
      </div>

      {/* AI Voice Reciter CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mic size={18} color="#818cf8" />
          <div>
            <strong style={{ display: 'block', color: '#fff', fontSize: '0.85rem' }}>AI Audio Briefing</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recite daily study goals with Sage Voice</span>
          </div>
        </div>

        <Button size="sm" variant={isSpeaking ? 'cyan' : 'outline'} onClick={speakDailyBriefing}>
          {isSpeaking ? <Pause size={14} /> : <Play size={14} />} {isSpeaking ? 'Pause' : 'Recite'}
        </Button>
      </div>
    </div>
  );
};

export default AIVoiceSoundscapeWidget;
