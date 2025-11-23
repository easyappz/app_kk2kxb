import React from 'react';
import './DialogList.css';

function DialogList({ dialogs, selectedDialog, onSelectDialog, currentUserId }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const truncateMessage = (text, maxLength = 40) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="dialog-list" data-easytag="id1-react/src/components/Messages/DialogList.jsx">
      {dialogs.length === 0 ? (
        <div className="empty-dialogs">
          <p>Нет диалогов</p>
        </div>
      ) : (
        dialogs.map((dialog) => (
          <div
            key={dialog.member.id}
            className={`dialog-item ${selectedDialog?.member?.id === dialog.member.id ? 'active' : ''} ${dialog.unread_count > 0 ? 'unread' : ''}`}
            onClick={() => onSelectDialog(dialog)}
          >
            <div className="dialog-avatar">
              <div className="avatar-circle" style={{ background: `linear-gradient(135deg, ${getColorForUser(dialog.member.id)})` }}>
                {dialog.member.first_name?.[0] || 'U'}{dialog.member.last_name?.[0] || ''}
              </div>
              {dialog.member.is_online && <div className="online-indicator"></div>}
            </div>
            <div className="dialog-content">
              <div className="dialog-header">
                <div className="dialog-name">
                  {dialog.member.first_name} {dialog.member.last_name}
                </div>
                {dialog.last_message && (
                  <div className="dialog-time">
                    {formatTime(dialog.last_message.created_at)}
                  </div>
                )}
              </div>
              <div className="dialog-message">
                <span className="message-preview">
                  {dialog.last_message ? (
                    <>
                      {dialog.last_message.sender === currentUserId && <span className="you-prefix">Вы: </span>}
                      {truncateMessage(dialog.last_message.content)}
                    </>
                  ) : (
                    'Нет сообщений'
                  )}
                </span>
                {dialog.unread_count > 0 && (
                  <div className="unread-badge">{dialog.unread_count}</div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function getColorForUser(id) {
  const colors = [
    '#667eea 0%, #764ba2 100%',
    '#f093fb 0%, #f5576c 100%',
    '#4facfe 0%, #00f2fe 100%',
    '#43e97b 0%, #38f9d7 100%',
    '#fa709a 0%, #fee140 100%',
    '#30cfd0 0%, #330867 100%',
    '#a8edea 0%, #fed6e3 100%',
    '#ff9a9e 0%, #fecfef 100%'
  ];
  return colors[id % colors.length];
}

export default DialogList;
