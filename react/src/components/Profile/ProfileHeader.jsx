import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendFriendRequest, getFriendRequests, removeFriend, acceptRequest } from '../../api/friends';
import { subscribeToMember, unsubscribeFromMember, getSubscriptions } from '../../api/subscriptions';
import './ProfileHeader.css';

function ProfileHeader({ member, currentUser, isOwnProfile, onlineStatus, onUpdateStatus }) {
  const navigate = useNavigate();
  const [relationshipStatus, setRelationshipStatus] = useState('none');
  const [outgoingRequestId, setOutgoingRequestId] = useState(null);
  const [incomingRequestId, setIncomingRequestId] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOwnProfile && currentUser) {
      checkRelationship();
    }
  }, [member.id, currentUser, isOwnProfile]);

  const checkRelationship = async () => {
    try {
      const [outgoingRequests, incomingRequests, subscriptions] = await Promise.all([
        getFriendRequests({ type: 'outgoing' }),
        getFriendRequests({ type: 'incoming' }),
        getSubscriptions({ type: 'my_subscriptions' })
      ]);

      const outgoing = outgoingRequests.results?.find(req => req.to_member.id === member.id && req.status === 'pending');
      const incoming = incomingRequests.results?.find(req => req.from_member.id === member.id && req.status === 'pending');
      const subscription = subscriptions.results?.find(sub => sub.to_member.id === member.id);

      if (outgoing) {
        setRelationshipStatus('request_sent');
        setOutgoingRequestId(outgoing.id);
      } else if (incoming) {
        setRelationshipStatus('request_received');
        setIncomingRequestId(incoming.id);
      } else {
        const areFriends = member.friends_count > 0;
        setRelationshipStatus(areFriends ? 'friends' : 'none');
      }

      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking relationship:', err);
    }
  };

  const handleAddFriend = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await sendFriendRequest(member.id);
      setRelationshipStatus('request_sent');
      await checkRelationship();
    } catch (err) {
      console.error('Error sending friend request:', err);
      alert('Не удалось отправить заявку в друзья');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (loading || !incomingRequestId) return;
    setLoading(true);
    try {
      await acceptRequest(incomingRequestId);
      setRelationshipStatus('friends');
      await checkRelationship();
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Не удалось принять заявку');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (loading) return;
    if (!window.confirm('Удалить из друзей?')) return;
    setLoading(true);
    try {
      await removeFriend(member.id);
      setRelationshipStatus('none');
      await checkRelationship();
    } catch (err) {
      console.error('Error removing friend:', err);
      alert('Не удалось удалить из друзей');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribeFromMember(member.id);
        setIsSubscribed(false);
      } else {
        await subscribeToMember(member.id);
        setIsSubscribed(true);
      }
      await checkRelationship();
    } catch (err) {
      console.error('Error toggling subscription:', err);
      alert('Не удалось изменить подписку');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    navigate('/messages', { state: { selectedUser: member } });
  };

  const getLastSeenText = () => {
    if (!onlineStatus.last_seen) return '';
    const lastSeen = new Date(onlineStatus.last_seen);
    const now = new Date();
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    return `${diffDays} дн. назад`;
  };

  return (
    <div className="profile-header" data-easytag="id2-react/src/components/Profile/ProfileHeader.jsx">
      <div className="profile-cover">
        {member.cover_image && <img src={member.cover_image} alt="Cover" />}
        <div className="cover-gradient"></div>
      </div>

      <div className="profile-info">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {member.avatar ? (
              <img src={member.avatar} alt={member.first_name} />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
            {onlineStatus.is_online && <div className="online-indicator"></div>}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-name-section">
            <h1 className="profile-name">
              {member.first_name} {member.last_name}
            </h1>
            {!isOwnProfile && (
              <span className="online-status">
                {onlineStatus.is_online ? (
                  <span className="status-online">● онлайн</span>
                ) : (
                  <span className="status-offline">был(а) {getLastSeenText()}</span>
                )}
              </span>
            )}
          </div>
          <p className="profile-username">@{member.username}</p>

          {!isOwnProfile && currentUser && (
            <div className="profile-actions">
              {relationshipStatus === 'none' && (
                <button
                  className="btn btn-primary"
                  onClick={handleAddFriend}
                  disabled={loading}
                >
                  ➕ Добавить в друзья
                </button>
              )}

              {relationshipStatus === 'request_sent' && (
                <button className="btn btn-secondary" disabled>
                  ✓ Заявка отправлена
                </button>
              )}

              {relationshipStatus === 'request_received' && (
                <button
                  className="btn btn-success"
                  onClick={handleAcceptRequest}
                  disabled={loading}
                >
                  ✓ Принять заявку
                </button>
              )}

              {relationshipStatus === 'friends' && (
                <button
                  className="btn btn-friend"
                  onClick={handleRemoveFriend}
                  disabled={loading}
                >
                  ✓ Друзья
                </button>
              )}

              <button
                className={`btn ${isSubscribed ? 'btn-subscribed' : 'btn-subscribe'}`}
                onClick={handleSubscribe}
                disabled={loading}
              >
                {isSubscribed ? '✓ Подписка' : '🔔 Подписаться'}
              </button>

              <button className="btn btn-message" onClick={handleMessage}>
                💬 Сообщение
              </button>
            </div>
          )}

          {isOwnProfile && (
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={() => navigate('/settings')}>
                ⚙️ Редактировать профиль
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;