import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import FriendsList from './FriendsList';
import FriendRequests from './FriendRequests';
import Followers from './Followers';
import Following from './Following';
import './Friends.css';

function Friends() {
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <MainLayout>
      <div className="friends-page" data-easytag="id1-react/src/components/Friends/index.jsx">
        <div className="page-header">
          <h1>Друзья</h1>
          <div className="friends-tabs">
            <button 
              className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Все друзья
            </button>
            <button 
              className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Заявки
            </button>
            <button 
              className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
              onClick={() => setActiveTab('followers')}
            >
              Подписчики
            </button>
            <button 
              className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              Подписки
            </button>
          </div>
        </div>

        <div className="friends-content">
          {activeTab === 'friends' && <FriendsList />}
          {activeTab === 'requests' && <FriendRequests />}
          {activeTab === 'followers' && <Followers />}
          {activeTab === 'following' && <Following />}
        </div>
      </div>
    </MainLayout>
  );
}

export default Friends;
