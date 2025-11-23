import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import FriendsList from './FriendsList';
import FriendRequests from './FriendRequests';
import Followers from './Followers';
import Following from './Following';
import './Friends.css';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends');

  const tabs = [
    { id: 'friends', label: 'Друзья', icon: '👥' },
    { id: 'requests', label: 'Заявки', icon: '📬' },
    { id: 'followers', label: 'Подписчики', icon: '👤' },
    { id: 'following', label: 'Подписки', icon: '📡' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'friends':
        return <FriendsList />;
      case 'requests':
        return <FriendRequests />;
      case 'followers':
        return <Followers />;
      case 'following':
        return <Following />;
      default:
        return <FriendsList />;
    }
  };

  return (
    <MainLayout>
      <div className="friends-page" data-easytag="id1-react/src/components/Friends/index.jsx">
        <div className="friends-container">
          <div className="friends-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="friends-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Friends;
