import React from 'react';
import { Box, Check, Sparkles } from 'lucide-react';
import { XR_MODELS, getModelsByContext } from '../../data/xrModels';
import { useTheme } from '../../context/ThemeContext';

export const XRModelSelector = ({ selectedModelId, onSelectModel, learnerContext }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const models = getModelsByContext(learnerContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isLight ? '#18345F' : '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color={isLight ? '#0284c7' : '#38bdf8'} />
          <span>Curated 3D Models for {learnerContext?.educationType?.toUpperCase() || 'SCHOOL'}</span>
        </div>
        <span style={{ fontSize: '0.78rem', color: isLight ? '#52668a' : '#94a3b8' }}>{models.length} Models Available</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {models.map(m => {
          const isSelected = selectedModelId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModel(m)}
              style={{
                minWidth: '220px',
                padding: '12px 14px',
                borderRadius: '14px',
                background: isSelected ? (isLight ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))') : (isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'rgba(15, 23, 42, 0.65)'),
                border: isSelected ? '2px solid #06b6d4' : (isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.08)'),
                color: isLight ? '#18345F' : '#ffffff',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 20px rgba(6, 182, 212, 0.3)' : (isLight ? '0 12px 30px rgba(180, 200, 230, 0.3)' : 'none')
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700 }}>
                  {m.category} • {m.topic}
                </span>
                {isSelected && <Check size={14} color="#06b6d4" />}
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isLight ? '#18345F' : '#fff' }}>{m.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default XRModelSelector;
