import React, { useState, useEffect } from 'react';
import { getSubscriptions } from '../../api/subscriptions';
import UserCard from './UserCard';
import './Following.css';

function Following() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFollowing();
  }, []);

  const loadFollowing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubscriptions({ type: 'my_subscriptions' });
      setFollowing(data.results || []);
    } catch (err) {
      setError('Не удалось загрузить подписки');
      console.error('Error loading following:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = (userId) => {
    setFollowing(following.filter(item => item.target.id !== userId));
  };

  if (loading) {
    return (
      <div className="following" data-easytag="id1-react/src/components/Friends/Following.jsx">
        <div className="loading-state">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="following" data-easytag="id1-react/src/components/Friends/Following.jsx">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (following.length === 0) {
    return (
      <div className="following" data-easytag="id1-react/src/components/Friends/Following.jsx">
        <div className="empty-state">
          <div className="empty-icon">📌</div>
          <h2>Нет подписок</h2>
          <p>Пользователи, на которых вы подписаны, будут здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className="following" data-easytag="id1-react/src/components/Friends/Following.jsx">
      <div className="following-grid">
        {following.map(item => (
          <UserCard 
            key={item.id} 
            user={item.target} 
            actionType="unsubscribe"
            onActionComplete={handleUnsubscribe}
          />
        ))}
      </div>
    </div>
  );
}

export default Following;
