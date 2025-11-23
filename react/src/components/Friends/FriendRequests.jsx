import React, { useState, useEffect } from 'react';
import { getFriendRequests } from '../../api/friends';
import UserCard from './UserCard';
import './FriendRequests.css';

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFriendRequests({ type: 'incoming' });
      setRequests(data.results || []);
    } catch (err) {
      setError('Не удалось загрузить заявки в друзья');
      console.error('Error loading friend requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestProcessed = (requestId) => {
    setRequests(requests.filter(request => request.id !== requestId));
  };

  if (loading) {
    return (
      <div className="friend-requests" data-easytag="id1-react/src/components/Friends/FriendRequests.jsx">
        <div className="loading-state">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friend-requests" data-easytag="id1-react/src/components/Friends/FriendRequests.jsx">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="friend-requests" data-easytag="id1-react/src/components/Friends/FriendRequests.jsx">
        <div className="empty-state">
          <div className="empty-icon">✉️</div>
          <h2>Нет новых заявок</h2>
          <p>Заявки в друзья будут отображаться здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friend-requests" data-easytag="id1-react/src/components/Friends/FriendRequests.jsx">
      <div className="requests-grid">
        {requests.map(request => (
          <UserCard 
            key={request.id} 
            user={request.from_member} 
            actionType="request"
            requestId={request.id}
            onActionComplete={handleRequestProcessed}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendRequests;
