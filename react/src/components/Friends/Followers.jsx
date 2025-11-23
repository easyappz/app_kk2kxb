import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { getSubscriptions } from '../../api/subscriptions';
import { sendFriendRequest } from '../../api/friends';
import './Followers.css';

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const navigate = useNavigate();

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

  const handleAddFriend = async (userId) => {
    if (processingIds.has(userId)) return;

    try {
      setProcessingIds(new Set([...processingIds, userId]));
      await sendFriendRequest(userId);
      alert('Заявка отправлена');
    } catch (err) {
      console.error('Error sending friend request:', err);
      alert('Не удалось отправить заявку');
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
      <div className="followers-loading" data-easytag="id1-react/src/components/Friends/Followers.jsx">
        <div className="spinner"></div>
        <p>Загрузка подписчиков...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="followers-error" data-easytag="id2-react/src/components/Friends/Followers.jsx">
        <p>{error}</p>
        <button onClick={loadFollowers} className="btn-retry">Попробовать снова</button>
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="followers-empty" data-easytag="id3-react/src/components/Friends/Followers.jsx">
        <div className="empty-icon">👤</div>
        <h3>У вас пока нет подписчиков</h3>
        <p>Люди, которые подписаны на вас, будут отображаться здесь</p>
      </div>
    );
  }

  return (
    <div className="followers" data-easytag="id4-react/src/components/Friends/Followers.jsx">
      <div className="followers-header">
        <h2>Подписчики</h2>
        <span className="followers-count">{followers.length}</span>
      </div>
      <div className="followers-grid">
        {followers.map((subscription) => (
          <UserCard
            key={subscription.id}
            user={subscription.subscriber}
            showOnlineStatus={true}
            actionButton={
              <div className="follower-actions">
                <button
                  onClick={() => handleViewProfile(subscription.subscriber.id)}
                  className="btn-secondary"
                >
                  Профиль
                </button>
                <button
                  onClick={() => handleAddFriend(subscription.subscriber.id)}
                  className="btn-primary"
                  disabled={processingIds.has(subscription.subscriber.id)}
                >
                  {processingIds.has(subscription.subscriber.id) ? 'Отправка...' : 'Добавить в друзья'}
                </button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Followers;
