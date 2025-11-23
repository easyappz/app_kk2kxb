import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import { getCurrentMember, updateMember, getSettings, updateSettings } from '../../api/members';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    email: '',
    notifications_enabled: true,
    privacy_level: 'public',
    password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, settingsData] = await Promise.all([
        getCurrentMember(),
        getSettings()
      ]);

      setCurrentUser(userData);
      setSettings(settingsData);

      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        bio: userData.bio || '',
        email: settingsData.email || '',
        notifications_enabled: settingsData.notifications_enabled !== false,
        privacy_level: settingsData.privacy_level || 'public',
        password: '',
        confirm_password: ''
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Не удалось загрузить настройки');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (formData.password && formData.password !== formData.confirm_password) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio
      };

      const settingsData = {
        email: formData.email,
        notifications_enabled: formData.notifications_enabled,
        privacy_level: formData.privacy_level
      };

      if (formData.password) {
        settingsData.password = formData.password;
      }

      await Promise.all([
        updateMember(currentUser.id, profileData),
        updateSettings(settingsData)
      ]);

      setSuccessMessage('Настройки успешно сохранены!');
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
      await fetchData();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="settings-loading" data-easytag="id1-react/src/components/Settings/Settings.jsx">
          <div className="loading-spinner"></div>
          <p>Загрузка настроек...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="settings-page" data-easytag="id1-react/src/components/Settings/Settings.jsx">
        <div className="settings-header">
          <h1>⚙️ Настройки</h1>
          <p className="settings-subtitle">Управляйте своим профилем и конфиденциальностью</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span>✓</span>
            <p>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h2>👤 Профиль</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Имя</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Введите имя"
                  required
                />
              </div>
              <div className="setting-item">
                <label>Фамилия</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Введите фамилию"
                  required
                />
              </div>
            </div>
            <div className="setting-item">
              <label>О себе</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Расскажите о себе..."
                rows="4"
                maxLength="500"
              />
              <span className="char-count">{formData.bio.length}/500</span>
            </div>
          </div>

          <div className="settings-section">
            <h2>📧 Контактная информация</h2>
            <div className="setting-item">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
              />
            </div>
          </div>

          <div className="settings-section">
            <h2>🔒 Безопасность</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Новый пароль</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Оставьте пустым, если не хотите менять"
                  autoComplete="new-password"
                />
              </div>
              <div className="setting-item">
                <label>Подтвердите пароль</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Повторите новый пароль"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>🔐 Конфиденциальность</h2>
            <div className="setting-item-toggle">
              <div>
                <strong>📡 Показывать статус онлайн</strong>
                <p>Другие пользователи смогут видеть, когда вы онлайн</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  name="notifications_enabled"
                  checked={formData.notifications_enabled}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <label>Приватность профиля</label>
              <select
                name="privacy_level"
                value={formData.privacy_level}
                onChange={handleChange}
              >
                <option value="public">🌍 Публичный (все видят)</option>
                <option value="friends">👥 Друзья (только друзья)</option>
                <option value="private">🔒 Приватный (только я)</option>
              </select>
            </div>
          </div>

          <div className="settings-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Отмена
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? 'Сохранение...' : '✓ Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default Settings;