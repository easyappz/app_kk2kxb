import React from 'react';
import MainLayout from '../Layout/MainLayout';
import './Messages.css';

function Messages() {
  return (
    <MainLayout>
      <div className="messages-page" data-easytag="id1-react/src/components/Messages/Messages.jsx">
        <div className="messages-container">
          <div className="messages-sidebar">
            <div className="messages-header">
              <h2>Сообщения</h2>
              <button className="new-message-button">✏️</button>
            </div>
            <div className="conversations-list">
              <div className="empty-conversations">
                <p>Нет сообщений</p>
              </div>
            </div>
          </div>

          <div className="messages-main">
            <div className="no-conversation-selected">
              <div className="empty-icon">💬</div>
              <h2>Выберите диалог</h2>
              <p>Выберите существующий диалог или начните новый</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Messages;