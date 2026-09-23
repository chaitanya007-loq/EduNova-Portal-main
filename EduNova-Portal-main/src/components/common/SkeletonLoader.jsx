import React from 'react';
import { EduNovaLoadingScreen } from './EduNovaLoadingScreen';

export const SkeletonLoader = ({ height = '240px', width = '100%', borderRadius = 'var(--radius-lg)' }) => {
  return (
    <EduNovaLoadingScreen
      fullScreen={false}
      minHeight={height}
      message="Negotiating with the Wi-Fi… 📶"
      subText="Fetching latest data telemetry"
    />
  );
};

export default SkeletonLoader;
