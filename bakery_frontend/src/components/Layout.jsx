import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  HomeIcon, ShopIcon, WarehouseIcon, ProductionIcon,
  RequestIcon, AnalyticsIcon, DistributeIcon, LogoutIcon
} from './Icons';

export default function Layout({ role, setRole, children }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app-layout">
      {/* --- MOBILE HEADER (Visible only on phones) --- */}
      <div className="mobile-header">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M10 9a2 2 0 014 0"/><path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"/>
          </svg>
          {t('appName')}
        </div>
        <button className="hamburger-btn" onClick={toggleMenu}>
          {/* Three line SVG (Hamburger) */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* --- SIDEBAR (Slide-in on mobile) --- */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M10 9a2 2 0 014 0"/><path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"/>
            </svg>
            {t('appName')}
          </div>
          <div className="language-switcher">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="sidebar-nav">
          {role === 'admin' && (
            <>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}><HomeIcon /> {t('dashboard')}</Link>
              <Link to="/manage-shops" className={location.pathname === '/manage-shops' ? 'active' : ''} onClick={closeMenu}><ShopIcon /> {t('manageShops')}</Link>
              <Link to="/warehouse" className={location.pathname === '/warehouse' ? 'active' : ''} onClick={closeMenu}><WarehouseIcon /> {t('warehouse')}</Link>
              <Link to="/production" className={location.pathname === '/production' ? 'active' : ''} onClick={closeMenu}><ProductionIcon /> {t('production')}</Link>
              <Link to="/admin-requests" className={location.pathname === '/admin-requests' ? 'active' : ''} onClick={closeMenu}><RequestIcon /> {t('shopRequests')}</Link>
              <Link to="/analytics" className={location.pathname === '/analytics' ? 'active' : ''} onClick={closeMenu}><AnalyticsIcon /> {t('analytics')}</Link>
              <Link to="/distribution" className={location.pathname === '/distribution' ? 'active' : ''} onClick={closeMenu}><DistributeIcon /> {t('distribution')}</Link>
              <Link to="/product-overview" className={location.pathname === '/product-overview' ? 'active' : ''} onClick={closeMenu}><DistributeIcon /> {t('productOverview')}</Link>
            </>
          )}
          {role === 'shop' && (
            <>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}><HomeIcon /> {t('dashboard')}</Link>
                <Link to="/shops" className={location.pathname === '/shops' ? 'active' : ''} onClick={closeMenu}><ShopIcon /> {t('myShops')}</Link>
                {/* NEW LINK */}
                <Link to="/catalog" className={location.pathname === '/catalog' ? 'active' : ''} onClick={closeMenu}><DistributeIcon /> {t('productCatalog')}</Link>
            </>
            )}
        </div>

        <div className="sidebar-footer">
          <button onClick={() => { setRole(null); closeMenu(); }} className="btn-switch-role">
            <LogoutIcon style={{ width: '18px', height: '18px' }} />
            <span>{t('switchRole')}</span>
          </button>
        </div>
      </div>

      {/* --- OVERLAY (Taps to close menu on mobile) --- */}
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        <div className="container">
          {children}
        </div>
      </div>
    </div>
  );
}