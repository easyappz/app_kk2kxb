import React from 'react';
import MainLayout from '../Layout/MainLayout';
import './Settings.css';

function Settings() {
  return (
    <MainLayout>
      <div className="settings-page" data-easytag="id1-react/src/components/Settings/Settings.jsx">
        <div className="settings-header">
          <h1>Настройки</h1>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h2>Профиль</h2>
            <div className="setting-item">
              <label>Имя</label>
              <input type="text" placeholder="Ваше имя" />
            </div>
            <div className="setting-item">
              <label>Фамилия</label>
              <input type="text" placeholder="Ваша фамилия" />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" placeholder="example@mail.com" />
            </div>
          </div>

          <div className="settings-section">
            <h2>Конфиденциальность</h2>
            <div className="setting-item-toggle">
              <div>
                <strong>Показывать статус онлайн</strong>
                <p>Другие пользователи смогут видеть, когда вы онлайн</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item-toggle">
              <div>
                <strong>Кто может писать мне сообщения</strong>
                <p>Разрешить отправку сообщений</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-actions">
            <button className="save-button">Сохранить изменения</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;