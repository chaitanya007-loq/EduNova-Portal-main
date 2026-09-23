import React from 'react';

export const Badge = ({ children, variant = 'indigo', icon: Icon }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'cyan': return 'cyber-badge-cyan';
      case 'emerald': return 'cyber-badge-emerald';
      case 'amber': return 'cyber-badge-amber';
      default: return 'cyber-badge';
    }
  };

  return (
    <span className={getBadgeClass()}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};
