import React, { useRef, useEffect } from 'react';
import './ChatWindow.css';

function ChatWindow({ messages, member, currentUserId, onLoadMore, hasMore, loading }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && hasMore && !loading) {
        onLoadMore();
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.created_at).toDateString();
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          type: 'date',
          date: message.created_at
        });
      }
      groups.push({
        type: 'message',
        data: message
      });
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chat-window" data-easytag="id1-react/src/components/Messages/ChatWindow.jsx">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar" style={{ background: `linear-gradient(135deg, ${getColorForUser(member.id)})` }}>
            {member.first_name?.[0] || 'U'}{member.last_name?.[0] || ''}
          </div>
          <div className="chat-user-details">
            <div className="chat-user-name">
              {member.first_name} {member.last_name}
            </div>
            <div className="chat-user-status">
              {member.is_online ? (
                <span className="status-online">● В сети</span>
              ) : (
                <span className="status-offline">Не в сети</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div 
        className="chat-messages" 
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loading && <div className="loading-more">Загрузка...</div>}
        {groupedMessages.map((item, index) => {
          if (item.type === 'date') {
            return (
              <div key={`date-${index}`} className="date-divider">
                <span>{formatDate(item.date)}</span>
              </div>
            );
          }

          const message = item.data;
          const isOwn = message.sender === currentUserId;

          return (
            <div key={message.id} className={`message ${isOwn ? 'own' : 'other'}`}>
              {!isOwn && (
                <div className="message-avatar" style={{ background: `linear-gradient(135deg, ${getColorForUser(member.id)})` }}>
                  {member.first_name?.[0] || 'U'}
                </div>
              )}
              <div className="message-bubble">
                <div className="message-content">{message.content}</div>
                <div className="message-time">
                  {formatTime(message.created_at)}
                  {isOwn && message.is_read && <span className="read-indicator"> ✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
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

export default ChatWindow;
