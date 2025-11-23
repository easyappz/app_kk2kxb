import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import { searchMembers } from '../../api/members';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const data = await searchMembers(searchQuery, { limit: 50 });
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const getColorForUser = (id) => {
    const colors = [
      '#667eea 0%, #764ba2 100%',
      '#f093fb 0%, #f5576c 100%',
      '#4facfe 0%, #00f2fe 100%',
      '#43e97b 0%, #38f9d7 100%',
      '#fa709a 0%, #fee140 100%',
      '#30cfd0 0%, #330867 100%',
      '#a8edea 0%, #fed6e3 100%',
      '#ff9a9e 0%, #fecfef 100%'
    ];
    return colors[id % colors.length];
  };

  return (
    <MainLayout>
      <div className="search-page" data-easytag="id1-react/src/components/Search/Search.jsx">
        <div className="search-header">
          <h1>Поиск пользователей</h1>
          <form onSubmit={handleSearch} className="search-form-main">
            <input
              type="text"
              className="search-input-main"
              placeholder="Введите имя или логин..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit" disabled={loading}>
              {loading ? 'Поиск...' : 'Найти'}
            </button>
          </form>
        </div>

        <div className="search-results">
          {!searched ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h2>Начните поиск</h2>
              <p>Введите имя или логин пользователя в поле выше</p>
            </div>
          ) : loading ? (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <h2>Поиск...</h2>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">😞</div>
              <h2>Ничего не найдено</h2>
              <p>Попробуйте изменить поисковый запрос</p>
            </div>
          ) : (
            <div className="users-grid">
              {results.map((user) => (
                <div 
                  key={user.id} 
                  className="user-card"
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="user-card-header" style={{ background: `linear-gradient(135deg, ${getColorForUser(user.id)})` }}>
                    <div className="user-avatar-large">
                      {user.first_name?.[0] || 'U'}{user.last_name?.[0] || ''}
                    </div>
                  </div>
                  <div className="user-card-body">
                    <h3 className="user-card-name">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="user-card-username">@{user.username}</p>
                    {user.bio && (
                      <p className="user-card-bio">{user.bio}</p>
                    )}
                    {user.is_online && (
                      <div className="user-online-status">
                        <span className="status-dot"></span>
                        В сети
                      </div>
                    )}
                  </div>
                  <div className="user-card-footer">
                    <button className="view-profile-button">
                      Посмотреть профиль
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Search;
