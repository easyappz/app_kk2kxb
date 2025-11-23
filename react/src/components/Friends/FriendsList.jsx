import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { getFriends, removeFriend } from '../../api/friends';
import './FriendsList.css';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFriends();
      setFriends(data.results || []);
    } catch (err) {
      setError('Не удалось загрузить список друзей');
      console.error('Error loading friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого друга?')) {
      return;
    }

    try {
      await removeFriend(friendId);
      setFriends(friends.filter(friend => friend.id !== friendId));
    } catch (err) {
      console.error('Error removing friend:', err);
      alert('Не удалось удалить друга');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="friends-list-loading" data-easytag="id1-react/src/components/Friends/FriendsList.jsx">
        <div className="spinner"></div>
        <p>Загрузка друзей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-list-error" data-easytag="id2-react/src/components/Friends/FriendsList.jsx">
        <p>{error}</p>
        <button onClick={loadFriends} className="btn-retry">Попробовать снова</button>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="friends-list-empty" data-easytag="id3-react/src/components/Friends/FriendsList.jsx">
        <div className="empty-icon">👥</div>
        <h3>У вас пока нет друзей</h3>
        <p>Найдите интересных людей через поиск</p>
        <button onClick={() => navigate('/search')} className="btn-search">
          Найти друзей
        </button>
      </div>
    );
  }

  return (
    <div className="friends-list" data-easytag="id4-react/src/components/Friends/FriendsList.jsx">
      <div className="friends-list-header">
        <h2>Мои друзья</h2>
        <span className="friends-count">{friends.length}</span>
      </div>
      <div className="friends-list-grid">
        {friends.map((friend) => (
          <UserCard
            key={friend.id}
            user={friend}
            showOnlineStatus={true}
            actionButton={
              <div className="friend-actions">
                <button
                  onClick={() => handleViewProfile(friend.id)}
                  className="btn-primary"
                >
                  Профиль
                </button>
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="btn-danger"
                >
                  Удалить
                </button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
