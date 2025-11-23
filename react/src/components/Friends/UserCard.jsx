import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptRequest, rejectRequest, removeFriend } from '../../api/friends';
import { unsubscribeFromMember } from '../../api/subscriptions';
import './UserCard.css';

function UserCard({ user, actionType, requestId, onActionComplete }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAccept = async () => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      setError(null);
      await acceptRequest(requestId);
      if (onActionComplete) {
        onActionComplete(requestId);
      }
    } catch (err) {
      setError('Ошибка при принятии заявки');
      console.error('Error accepting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      setError(null);
      await rejectRequest(requestId);
      if (onActionComplete) {
        onActionComplete(requestId);
      }
    } catch (err) {
      setError('Ошибка при отклонении заявки');
      console.error('Error rejecting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      await removeFriend(user.id);
      if (onActionComplete) {
        onActionComplete(user.id);
      }
    } catch (err) {
      setError('Ошибка при удалении из друзей');
      console.error('Error removing friend:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      await unsubscribeFromMember(user.id);
      if (onActionComplete) {
        onActionComplete(user.id);
      }
    } catch (err) {
      setError('Ошибка при отписке');
      console.error('Error unsubscribing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-card" data-easytag="id1-react/src/components/Friends/UserCard.jsx">
      <div className="user-card-header">
        <div className="user-avatar" onClick={handleProfileClick}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          {user.is_online && <div className="online-indicator"></div>}
        </div>
      </div>
      
      <div className="user-card-body">
        <h3 className="user-name" onClick={handleProfileClick}>
          {user.username || 'Пользователь'}
        </h3>
        {user.bio && <p className="user-bio">{user.bio}</p>}
        {user.is_online !== undefined && (
          <div className="user-status">
            {user.is_online ? (
              <span className="status-online">● Онлайн</span>
            ) : (
              <span className="status-offline">● Был(а) недавно</span>
            )}
          </div>
        )}
      </div>

      {error && <div className="card-error">{error}</div>}

      <div className="user-card-actions">
        {actionType === 'request' && (
          <>
            <button 
              className="btn-accept" 
              onClick={handleAccept}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Принять'}
            </button>
            <button 
              className="btn-reject" 
              onClick={handleReject}
              disabled={loading}
            >
              Отклонить
            </button>
          </>
        )}
        
        {actionType === 'remove' && (
          <button 
            className="btn-remove" 
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Удалить из друзей'}
          </button>
        )}
        
        {actionType === 'unsubscribe' && (
          <button 
            className="btn-unsubscribe" 
            onClick={handleUnsubscribe}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Отписаться'}
          </button>
        )}
        
        {actionType === 'none' && (
          <button className="btn-view" onClick={handleProfileClick}>
            Перейти в профиль
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
