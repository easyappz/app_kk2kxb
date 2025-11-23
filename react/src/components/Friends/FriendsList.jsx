import React, { useState, useEffect } from 'react';
import { getFriends } from '../../api/friends';
import UserCard from './UserCard';
import './FriendsList.css';

function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleRemoveFriend = (friendId) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
  };

  if (loading) {
    return (
      <div className="friends-list" data-easytag="id1-react/src/components/Friends/FriendsList.jsx">
        <div className="loading-state">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-list" data-easytag="id1-react/src/components/Friends/FriendsList.jsx">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="friends-list" data-easytag="id1-react/src/components/Friends/FriendsList.jsx">
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h2>Список друзей пуст</h2>
          <p>Начните добавлять друзей, чтобы увидеть их здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-list" data-easytag="id1-react/src/components/Friends/FriendsList.jsx">
      <div className="friends-grid">
        {friends.map(friend => (
          <UserCard 
            key={friend.id} 
            user={friend} 
            actionType="remove"
            onActionComplete={handleRemoveFriend}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
