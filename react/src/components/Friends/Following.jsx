import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { getSubscriptions, unsubscribeFromMember } from '../../api/subscriptions';
import './Following.css';

const Following = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const navigate = useNavigate();

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

  const handleUnsubscribe = async (userId) => {
    if (processingIds.has(userId)) return;

    if (!window.confirm('Вы уверены, что хотите отписаться?')) {
      return;
    }

    try {
      setProcessingIds(new Set([...processingIds, userId]));
      await unsubscribeFromMember(userId);
      setFollowing(following.filter(sub => sub.subscribed_to.id !== userId));
    } catch (err) {
      console.error('Error unsubscribing:', err);
      alert('Не удалось отписаться');
    } finally {
      const newSet = new Set(processingIds);
      newSet.delete(userId);
      setProcessingIds(newSet);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="following-loading" data-easytag="id1-react/src/components/Friends/Following.jsx">
        <div className="spinner"></div>
        <p>Загрузка подписок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="following-error" data-easytag="id2-react/src/components/Friends/Following.jsx">
        <p>{error}</p>
        <button onClick={loadFollowing} className="btn-retry">Попробовать снова</button>
      </div>
    );
  }

  if (following.length === 0) {
    return (
      <div className="following-empty" data-easytag="id3-react/src/components/Friends/Following.jsx">
        <div className="empty-icon">📡</div>
        <h3>Вы ни на кого не подписаны</h3>
        <p>Подпишитесь на интересных людей, чтобы следить за их публикациями</p>
        <button onClick={() => navigate('/search')} className="btn-search">
          Найти людей
        </button>
      </div>
    );
  }

  return (
    <div className="following" data-easytag="id4-react/src/components/Friends/Following.jsx">
      <div className="following-header">
        <h2>Подписки</h2>
        <span className="following-count">{following.length}</span>
      </div>
      <div className="following-grid">
        {following.map((subscription) => (
          <UserCard
            key={subscription.id}
            user={subscription.subscribed_to}
            showOnlineStatus={true}
            actionButton={
              <div className="following-actions">
                <button
                  onClick={() => handleViewProfile(subscription.subscribed_to.id)}
                  className="btn-secondary"
                >
                  Профиль
                </button>
                <button
                  onClick={() => handleUnsubscribe(subscription.subscribed_to.id)}
                  className="btn-danger"
                  disabled={processingIds.has(subscription.subscribed_to.id)}
                >
                  {processingIds.has(subscription.subscribed_to.id) ? 'Обработка...' : 'Отписаться'}
                </button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Following;
