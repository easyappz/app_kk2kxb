import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { getFriendRequests, acceptRequest, rejectRequest } from '../../api/friends';
import './FriendRequests.css';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const navigate = useNavigate();

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

  const handleAccept = async (requestId) => {
    if (processingIds.has(requestId)) return;

    try {
      setProcessingIds(new Set([...processingIds, requestId]));
      await acceptRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Не удалось принять заявку');
    } finally {
      const newSet = new Set(processingIds);
      newSet.delete(requestId);
      setProcessingIds(newSet);
    }
  };

  const handleReject = async (requestId) => {
    if (processingIds.has(requestId)) return;

    try {
      setProcessingIds(new Set([...processingIds, requestId]));
      await rejectRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Не удалось отклонить заявку');
    } finally {
      const newSet = new Set(processingIds);
      newSet.delete(requestId);
      setProcessingIds(newSet);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="friend-requests-loading" data-easytag="id1-react/src/components/Friends/FriendRequests.jsx">
        <div className="spinner"></div>
        <p>Загрузка заявок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friend-requests-error" data-easytag="id2-react/src/components/Friends/FriendRequests.jsx">
        <p>{error}</p>
        <button onClick={loadRequests} className="btn-retry">Попробовать снова</button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="friend-requests-empty" data-easytag="id3-react/src/components/Friends/FriendRequests.jsx">
        <div className="empty-icon">📬</div>
        <h3>Нет новых заявок</h3>
        <p>Здесь будут отображаться входящие заявки в друзья</p>
      </div>
    );
  }

  return (
    <div className="friend-requests" data-easytag="id4-react/src/components/Friends/FriendRequests.jsx">
      <div className="friend-requests-header">
        <h2>Заявки в друзья</h2>
        <span className="requests-count">{requests.length}</span>
      </div>
      <div className="friend-requests-list">
        {requests.map((request) => (
          <UserCard
            key={request.id}
            user={request.from_member}
            showOnlineStatus={true}
            actionButton={
              <div className="request-actions">
                <button
                  onClick={() => handleViewProfile(request.from_member.id)}
                  className="btn-secondary"
                  disabled={processingIds.has(request.id)}
                >
                  Профиль
                </button>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="btn-success"
                  disabled={processingIds.has(request.id)}
                >
                  {processingIds.has(request.id) ? 'Обработка...' : 'Принять'}
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="btn-danger"
                  disabled={processingIds.has(request.id)}
                >
                  Отклонить
                </button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
