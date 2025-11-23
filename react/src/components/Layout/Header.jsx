import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import './Header.css';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="header" data-easytag="id1-react/src/components/Layout/Header.jsx">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">🌟</span>
            <span className="logo-text">SocialNet</span>
          </Link>

          {isAuthenticated && (
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </form>
          )}
        </div>

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Главная</span>
              </Link>
              <Link to="/friends" className="nav-link">
                <span className="nav-icon">👥</span>
                <span className="nav-text">Друзья</span>
              </Link>
              <Link to="/messages" className="nav-link">
                <span className="nav-icon">💬</span>
                <span className="nav-text">Сообщения</span>
              </Link>
              <div className="nav-link notifications">
                <span className="nav-icon">🔔</span>
                <span className="nav-text">Уведомления</span>
                <span className="notification-badge">3</span>
              </div>
              <Link to="/settings" className="nav-link">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Настройки</span>
              </Link>
              <button onClick={handleLogout} className="nav-link logout-button">
                <span className="nav-icon">🚪</span>
                <span className="nav-text">Выход</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <span className="nav-text">Вход</span>
              </Link>
              <Link to="/register" className="nav-link nav-link-primary">
                <span className="nav-text">Регистрация</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;