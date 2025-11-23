import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e) => {
    e.preventDefault();
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
            <button type="submit" className="search-submit">Найти</button>
          </form>
        </div>

        <div className="search-results">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>Начните поиск</h2>
            <p>Введите имя или логин пользователя в поле выше</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Search;