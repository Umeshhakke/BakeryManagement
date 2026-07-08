import React from 'react';

// Professional SVG Icons (Clean, stroke-based, premium look)
const Icon = ({ children, className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const HomeIcon = ({ className }) => (
  <Icon className={className}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>
);

export const ShopIcon = ({ className }) => (
  <Icon className={className}><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M10 9a2 2 0 014 0"/><path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"/></Icon>
);

export const WarehouseIcon = ({ className }) => (
  <Icon className={className}><path d="M20 7h-4V5h-8v2H4v10h4v4h8v-4h4V7z"/><path d="M12 17v4"/><path d="M8 12h8"/></Icon>
);

export const ProductionIcon = ({ className }) => (
  <Icon className={className}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></Icon>
);

export const RequestIcon = ({ className }) => (
  <Icon className={className}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 10h8"/><path d="M8 14h5"/></Icon>
);

export const AnalyticsIcon = ({ className }) => (
  <Icon className={className}><path d="M21 21v-6"/><path d="M3 21v-6"/><path d="M9 21v-9"/><path d="M15 21v-12"/></Icon>
);

export const DistributeIcon = ({ className }) => (
  <Icon className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>
);

export const LogoutIcon = ({ className }) => (
  <Icon className={className}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
);