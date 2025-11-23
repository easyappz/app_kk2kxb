import React from 'react';
import './UserCard.css';

const UserCard = ({ user, actionButton, showOnlineStatus = true }) => {
  return (
    <div className="user-card" data-easytag="id1-react/src/components/Friends/UserCard.jsx">
      <div className="user-card-avatar">
        {user.avatar ? (
          <img src={user.avatar} alt={user.username} />
        ) : (
          <div className="user-card-avatar-placeholder">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}
        {showOnlineStatus && user.is_online && (
          <span className="user-card-online-indicator"></span>
        )}
      </div>
      <div className="user-card-info">
        <h3 className="user-card-name">
          {user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.username}
        </h3>
        <p className="user-card-username">@{user.username}</p>
        {user.bio && <p className="user-card-bio">{user.bio}</p>}
        <div className="user-card-stats">
          <span>{user.friends_count || 0} друзей</span>
          <span>{user.subscribers_count || 0} подписчиков</span>
        </div>
      </div>
      {actionButton && <div className="user-card-actions">{actionButton}</div>}
    </div>
  );
};

export default UserCard;
