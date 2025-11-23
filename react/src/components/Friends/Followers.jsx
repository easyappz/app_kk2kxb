import React, { useState, useEffect } from 'react';
import { getSubscriptions } from '../../api/subscriptions';
import UserCard from './UserCard';
import './Followers.css';

function Followers() {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFollowers();
  }, []);

  const loadFollowers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubscriptions({ type: 'my_subscribers' });
      setFollowers(data.results || []);
    } catch (err) {
      setError('Не удалось загрузить подписчиков');
      console.error('Error loading followers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="followers" data-easytag="id1-react/src/components/Friends/Followers.jsx">
        <div className="loading-state">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="followers" data-easytag="id1-react/src/components/Friends/Followers.jsx">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="followers" data-easytag="id1-react/src/components/Friends/Followers.jsx">
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h2>Нет подписчиков</h2>
          <p>Пользователи, которые на вас подписаны, будут здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className="followers" data-easytag="id1-react/src/components/Friends/Followers.jsx">
      <div className="followers-grid">
        {followers.map(follower => (
          <UserCard 
            key={follower.id} 
            user={follower.subscriber} 
            actionType="none"
          />
        ))}
      </div>
    </div>
  );
}

export default Followers;
