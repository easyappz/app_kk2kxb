import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

function MainLayout({ children }) {
  return (
    <div className="main-layout" data-easytag="id1-react/src/components/Layout/MainLayout.jsx">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;