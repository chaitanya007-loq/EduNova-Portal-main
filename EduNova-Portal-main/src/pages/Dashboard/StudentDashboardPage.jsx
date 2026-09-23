import React from 'react';
import { EduNovaPixelPerfectDashboard } from '../../components/dashboard/EduNovaPixelPerfectDashboard';

export const StudentDashboardPage = ({ track }) => {
  return (
    <div style={{ paddingTop: '8px', width: '100%' }}>
      <EduNovaPixelPerfectDashboard initialTrackProp={track} />
    </div>
  );
};

export default StudentDashboardPage;

