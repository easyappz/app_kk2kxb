import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import ProfileHeader from './ProfileHeader';
import ProfilePosts from './ProfilePosts';
import { getMember, getCurrentMember, getOnlineStatus } from '../../api/members';
import { getFriends } from '../../api/friends';
import './Profile.css';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({ is_online: false, last_seen: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [memberData, currentUserData] = await Promise.all([
          getMember(id),
          getCurrentMember()
        ]);

        setMember(memberData);
        setCurrentUser(currentUserData);

        const [friendsData, statusData] = await Promise.all([
          getFriends({ member_id: id, limit: 6 }),
          getOnlineStatus(id)
        ]);

        setFriends(friendsData.results || []);
        setOnlineStatus(statusData);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      const statusData = await getOnlineStatus(id);
      setOnlineStatus(statusData);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="profile-loading" data-easytag="id1-react/src/components/Profile/index.jsx">
          <div className="loading-spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !member) {
    return (
      <MainLayout>
        <div className="profile-error" data-easytag="id1-react/src/components/Profile/index.jsx">
          <h2>Ошибка</h2>
          <p>{error || 'Профиль не найден'}</p>
          <button onClick={() => navigate('/')}>На главную</button>
        </div>
      </MainLayout>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === member.id;

  return (
    <MainLayout>
      <div className="profile-page" data-easytag="id1-react/src/components/Profile/index.jsx">
        <ProfileHeader
          member={member}
          currentUser={currentUser}
          isOwnProfile={isOwnProfile}
          onlineStatus={onlineStatus}
          onUpdateStatus={handleUpdateStatus}
        />

        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-section">
              <h2>О себе</h2>
              {member.bio ? (
                <p className="profile-bio">{member.bio}</p>
              ) : (
                <p className="profile-bio-empty">
                  {isOwnProfile ? 'Добавьте информацию о себе' : 'Пользователь не добавил информацию о себе'}
                </p>
              )}
            </div>

            <ProfilePosts memberId={id} isOwnProfile={isOwnProfile} />
          </div>

          <div className="profile-sidebar">
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{member.friends_count || 0}</span>
                <span className="stat-label">Друзей</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{member.subscribers_count || 0}</span>
                <span className="stat-label">Подписчиков</span>
              </div>
            </div>

            {friends.length > 0 && (
              <div className="profile-friends-widget">
                <div className="widget-header">
                  <h3>Друзья</h3>
                  <button onClick={() => navigate('/friends')}>Все</button>
                </div>
                <div className="friends-grid">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="friend-item"
                      onClick={() => navigate(`/profile/${friend.id}`)}
                    >
                      <div className="friend-avatar">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt={friend.first_name} />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <span className="friend-name">
                        {friend.first_name} {friend.last_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;