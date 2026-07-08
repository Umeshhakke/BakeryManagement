import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Home.css';

export default function Home({ setRole }) {
  const { t } = useLanguage();

  return (
    <div className="home-page">
      <div className="card home-card">
        <h1 className="home-title">🥖 {t('appName')}</h1>
        <p className="home-subtitle">{t('selectRole')}</p>
        <div className="role-options">
          <div className="role-option" onClick={() => setRole('shop')}>
            <div className="role-icon">🏪</div>
            <div className="role-title">{t('shopOwner')}</div>
            <div className="role-desc">{t('manageShops')}</div>
          </div>
          <div className="role-option" onClick={() => setRole('admin')}>
            <div className="role-icon">🏭</div>
            <div className="role-title">{t('admin')}</div>
            <div className="role-desc">{t('warehouse')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}