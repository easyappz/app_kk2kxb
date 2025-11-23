import React from 'react';
import MainLayout from '../Layout/MainLayout';
import './Home.css';

function Home() {
  return (
    <MainLayout>
      <div className="home-page" data-easytag="id1-react/src/components/Home/index.jsx">
        <div className="create-post-card">
          <div className="create-post-header">
            <div className="user-avatar">👤</div>
            <input
              type="text"
              className="create-post-input"
              placeholder="Что у вас нового?"
            />
          </div>
          <div className="create-post-actions">
            <button className="post-action-button">
              <span>📷</span>
              Фото
            </button>
            <button className="post-action-button">
              <span>🎬</span>
              Видео
            </button>
            <button className="post-action-button">
              <span>😊</span>
              Настроение
            </button>
          </div>
        </div>

        <div className="feed-section">
          <h2 className="feed-title">Лента новостей</h2>
          <div className="empty-feed">
            <div className="empty-icon">📰</div>
            <h3>Лента пуста</h3>
            <p>Добавьте друзей, чтобы видеть их публикации</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export { Home };