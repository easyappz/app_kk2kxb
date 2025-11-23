import React from 'react';
import MainLayout from '../Layout/MainLayout';
import './Friends.css';

function Friends() {
  return (
    <MainLayout>
      <div className="friends-page" data-easytag="id1-react/src/components/Friends/Friends.jsx">
        <div className="page-header">
          <h1>Друзья</h1>
          <div className="friends-tabs">
            <button className="tab-button active">Все друзья</button>
            <button className="tab-button">Заявки</button>
            <button className="tab-button">Подписки</button>
          </div>
        </div>

        <div className="friends-content">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h2>Список друзей пуст</h2>
            <p>Начните добавлять друзей, чтобы увидеть их здесь</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Friends;