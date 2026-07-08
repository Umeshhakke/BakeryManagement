import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'hi', label: '🇮🇳 हिंदी' },
  { code: 'mr', label: '🇮🇳 मराठी' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      style={{
        background: 'transparent',
        border: '1px solid #555',
        color: '#d6d3d1',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
      }}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}