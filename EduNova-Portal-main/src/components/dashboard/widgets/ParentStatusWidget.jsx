import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, HeartHandshake, UserPlus, ExternalLink, Check, Mail } from 'lucide-react';
import { Button } from '../../common/Button';
import parentCompanionService from '../../../services/parentCompanionService';

export const ParentStatusWidget = () => {
  const navigate = useNavigate();
  const [companionState, setCompanionState] = useState(parentCompanionService.getParentCompanionState());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invited, setInvited] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    parentCompanionService.inviteParent(inviteEmail);
    setCompanionState(parentCompanionService.getParentCompanionState());
    setInvited(true);
    setTimeout(() => {
      setInvited(false);
      setIsModalOpen(false);
    }, 1500);
  };

  const isConnected = companionState.connectionStatus === 'ACTIVE';
  const isPending = companionState.connectionStatus === 'PENDING';

  return (
    <>
      <div style={{
        background: 'var(--glass-bg)',
        padding: '20px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isConnected ? '#10b981' : '#818cf8'
          }}>
            <HeartHandshake size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Parent Companion</strong>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                background: isConnected ? 'rgba(16, 185, 129, 0.2)' : isPending ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                color: isConnected ? '#10b981' : isPending ? '#f59e0b' : 'var(--text-muted)'
              }}>
                {isConnected ? '✓ Connected' : isPending ? 'Invitation Pending' : 'Not Connected'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {isConnected
                ? `Connected to ${companionState.parentName || companionState.parentEmail} • Student privacy firewall active`
                : 'Connect a parent/guardian to share verified learning progress reports.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isConnected ? (
            <Button size="sm" variant="outline" onClick={() => navigate('/parent-dashboard')}>
              Parent Dashboard View <ExternalLink size={14} />
            </Button>
          ) : (
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <UserPlus size={14} /> Invite Parent
            </Button>
          )}
        </div>
      </div>

      {/* Invite Parent Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(5, 8, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-glow)',
            width: '100%',
            maxWidth: '460px',
            padding: '28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartHandshake size={22} color="#06b6d4" /> Invite Parent / Guardian
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Enter your parent/guardian email below. They will receive a secure invitation link. Connection only becomes active after parent accepts.
            </p>

            {invited ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: 'var(--radius-md)', color: '#10b981', textAlign: 'center', fontWeight: 700 }}>
                ✓ Invitation sent successfully!
              </div>
            ) : (
              <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Parent / Guardian Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. parent.nair@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ background: 'rgba(8, 12, 30, 0.6)', padding: '12px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-cyan)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  <strong>Privacy Assurance:</strong> Private AI chats, personal notes, and 1-on-1 peer messages remain strictly private.
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Send Invitation <Mail size={14} />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ParentStatusWidget;
