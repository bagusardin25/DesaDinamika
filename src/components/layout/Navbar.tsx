'use client';
import React from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar glass">
        <div className="logo">
            <i className="fa-solid fa-leaf text-primary"></i> 
            <span>Desa<span className="text-primary">Dinamika</span></span>
        </div>
        <div className="nav-links">
            <button 
              className={`nav-btn ${currentView === 'view-landing' ? 'active' : ''}`} 
              onClick={() => onNavigate('view-landing')}
            >
              <i className="fa-solid fa-house"></i> Beranda
            </button>
            <button 
              className={`nav-btn ${['view-dashboard', 'view-setup', 'view-simulation', 'view-report'].includes(currentView) ? 'active' : ''}`} 
              onClick={() => onNavigate('view-dashboard')}
            >
              <i className="fa-solid fa-briefcase"></i> Meja Kerja Kades
            </button>
            <div className="user-profile">
                <img src="https://i.pravatar.cc/150?img=11" alt="Admin Profile" />
                <span>Kades Budi</span>
            </div>
        </div>
    </nav>
  );
}
