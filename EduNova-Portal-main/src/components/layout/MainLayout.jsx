import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { MobileNav } from '../common/MobileNav';
import { Footer } from '../common/Footer';
import { FloatingAIButton } from '../ai/FloatingAIButton';
import { SearchModal } from '../common/SearchModal';
import { BackgroundParticles } from '../common/BackgroundParticles';
import { GlobalTopHeader } from './GlobalTopHeader';
import { useAuth } from '../../context/AuthContext';

export const MainLayout = () => {
  const { isAuthenticated, isParent, loading } = useAuth();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isParentMode = isParent || location.pathname.startsWith('/parent');
  const isLandingPage = location.pathname === '/' || location.pathname === '/about';
  const showPublicNavFooter = !isAuthenticated && !loading && !isLandingPage;
  const showAuthenticatedUI = isAuthenticated && !loading && !isLandingPage;
  const isColumnLayout = showPublicNavFooter || isLandingPage;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isColumnLayout ? 'column' : 'row',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-mesh-gradient)',
      position: 'relative',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      backfaceVisibility: 'hidden'
    }}>

      <BackgroundParticles />

      {/* Public Navbar (Only when unauthenticated, not loading, and not on landing page) */}
      {showPublicNavFooter && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        height: showPublicNavFooter ? 'calc(100vh - 72px)' : '100vh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {showAuthenticatedUI && <Sidebar />}

        <main style={{
          flex: 1,
          minWidth: 0,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          padding: showAuthenticatedUI ? '16px 20px 40px 16px' : '0',
          scrollBehavior: 'smooth'
        }}>
          {showAuthenticatedUI && <GlobalTopHeader />}
          <Outlet />
          {showPublicNavFooter && <Footer />}
        </main>
      </div>

      {!isParentMode && showAuthenticatedUI && <FloatingAIButton />}
      {showAuthenticatedUI && <MobileNav />}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default MainLayout;
