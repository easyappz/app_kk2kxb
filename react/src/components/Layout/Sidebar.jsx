import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Моя лента', color: '#667eea' },
    { path: '/profile/me', icon: '👤', label: 'Мой профиль', color: '#764ba2' },
    { path: '/friends', icon: '👥', label: 'Друзья', color: '#f59e0b' },
    { path: '/messages', icon: '💬', label: 'Сообщения', color: '#ec4899' },
    { path: '/search', icon: '🔍', label: 'Поиск', color: '#10b981' },
    { path: '/settings', icon: '⚙️', label: 'Настройки', color: '#6b7280' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar" data-easytag="id1-react/src/components/Layout/Sidebar.jsx">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Навигация</h3>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                style={{
                  '--link-color': item.color
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {isActive(item.path) && <span className="active-indicator"></span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Быстрые ссылки</h3>
          <div className="quick-links">
            <div className="quick-link">
              <span className="quick-icon">📸</span>
              <span className="quick-text">Фотографии</span>
            </div>
            <div className="quick-link">
              <span className="quick-icon">🎵</span>
              <span className="quick-text">Музыка</span>
            </div>
            <div className="quick-link">
              <span className="quick-icon">🎬</span>
              <span className="quick-text">Видео</span>
            </div>
            <div className="quick-link">
              <span className="quick-icon">👥</span>
              <span className="quick-text">Группы</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="online-status">
            <div className="status-indicator online"></div>
            <span className="status-text">Онлайн</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;