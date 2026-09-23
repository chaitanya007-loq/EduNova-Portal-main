import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileCheck, Award, Glasses, Repeat, Bot, Target, PlayCircle, Code2, Users, FileText } from 'lucide-react';
import { Button } from '../../common/Button';

export const DashboardQuickActionsBar = ({ educationType = 'school' }) => {
  const navigate = useNavigate();

  const getActions = () => {
    switch (educationType.toLowerCase()) {
      case 'school':
        return [
          { label: 'Start Homework', icon: FileCheck, path: '/study-planner', variant: 'primary' },
          { label: 'My Notes', icon: FileText, path: '/my-subjects', variant: 'outline' },
          { label: 'Take Quiz', icon: Award, path: '/courses', variant: 'outline' },
          { label: 'Revise Topic', icon: Repeat, path: '/my-subjects', variant: 'outline' },
          { label: 'Ask Sage AI', icon: Bot, path: '/ai-assistant', variant: 'outline' },
          { label: 'XR Labs', icon: Glasses, path: '/immersive-lab', variant: 'outline' }
        ];
      case 'college':
        return [
          { label: 'Open Assignment', icon: FileCheck, path: '/study-planner', variant: 'primary' },
          { label: 'My Notes', icon: FileText, path: '/my-subjects', variant: 'outline' },
          { label: 'Continue Project', icon: Code2, path: '/my-subjects', variant: 'outline' },
          { label: 'Peer Exchange', icon: Users, path: '/skill-exchange', variant: 'outline' },
          { label: 'Ask Sage AI', icon: Bot, path: '/ai-assistant', variant: 'outline' },
          { label: 'XR Studio', icon: Glasses, path: '/xr-studio', variant: 'outline' }
        ];
      case 'exam':
        return [
          { label: 'Take Mock Test', icon: PlayCircle, path: '/courses', variant: 'primary' },
          { label: 'My Notes', icon: FileText, path: '/my-subjects', variant: 'outline' },
          { label: 'Practice Weak Topic', icon: Target, path: '/my-subjects', variant: 'outline' },
          { label: 'Revise Formulas', icon: Repeat, path: '/study-planner', variant: 'outline' },
          { label: 'Ask Sage AI', icon: Bot, path: '/ai-assistant', variant: 'outline' }
        ];
      case 'skills':
      default:
        return [
          { label: 'Continue Roadmap', icon: Target, path: '/learning-path', variant: 'primary' },
          { label: 'My Notes', icon: FileText, path: '/my-subjects', variant: 'outline' },
          { label: 'Practice Skill', icon: BookOpen, path: '/courses', variant: 'outline' },
          { label: 'Build Project', icon: Code2, path: '/my-subjects', variant: 'outline' },
          { label: 'Find Mentor', icon: Users, path: '/skill-exchange', variant: 'outline' },
          { label: 'Ask Sage AI', icon: Bot, path: '/ai-assistant', variant: 'outline' }
        ];
    }
  };

  const actions = getActions();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      overflowX: 'auto',
      paddingBottom: '4px',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', marginRight: '4px' }}>
        Quick Actions:
      </span>
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <Button
            key={idx}
            size="sm"
            variant={act.variant}
            onClick={() => navigate(act.path)}
            style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-lg)' }}
          >
            <Icon size={14} /> {act.label}
          </Button>
        );
      })}
    </div>
  );
};

export default DashboardQuickActionsBar;
