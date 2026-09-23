import React from 'react';

export const Card = ({ children, className = '', style = {}, hoverEffect = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}
      style={{
        padding: '20px',
        ...style
      }}
    >
      {children}
    </div>
  );
};
