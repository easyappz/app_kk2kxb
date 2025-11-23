import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import './Profile.css';

function Profile() {
  const { id } = useParams();

  return (
    <MainLayout>
      <div className="profile-page" data-easytag="id1-react/src/components/Profile/Profile.jsx">
        <div className="profile-header">
          <div className="profile-cover">
            <div className="cover-gradient"></div>
          </div>
          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-placeholder">👤</div>
            </div>
            <div className="profile-details">
              <h1 className="profile-name">Профиль пользователя</h1>
              <p className="profile-username">@user{id}</p>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>О себе</h2>
            <p className="profile-bio">Информация о пользователе появится здесь...</p>
          </div>

          <div className="profile-section">
            <h2>Публикации</h2>
            <div className="posts-placeholder">
              <p>Посты пользователя будут отображаться здесь</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;