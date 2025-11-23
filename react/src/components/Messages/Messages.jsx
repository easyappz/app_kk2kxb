import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import DialogList from './DialogList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import { getDialogs, getMessages, sendMessage } from '../../api/messages';
import { getCurrentMember } from '../../api/members';
import './Messages.css';

function Messages() {
  const [dialogs, setDialogs] = useState([]);
  const [selectedDialog, setSelectedDialog] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [messagesOffset, setMessagesOffset] = useState(0);

  useEffect(() => {
    loadCurrentUser();
    loadDialogs();
  }, []);

  useEffect(() => {
    if (selectedDialog) {
      loadMessages(selectedDialog.member.id);
    }
  }, [selectedDialog]);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentMember();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  };

  const loadDialogs = async () => {
    try {
      setLoading(true);
      const data = await getDialogs({ limit: 50 });
      setDialogs(data.results || []);
    } catch (error) {
      console.error('Failed to load dialogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (memberId, offset = 0) => {
    try {
      setMessagesLoading(true);
      const data = await getMessages(memberId, { limit: 30, offset });
      if (offset === 0) {
        setMessages(data.results || []);
      } else {
        setMessages(prev => [...(data.results || []), ...prev]);
      }
      setHasMore(data.count > (offset + 30));
      setMessagesOffset(offset);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectDialog = (dialog) => {
    setSelectedDialog(dialog);
    setMessages([]);
    setMessagesOffset(0);
  };

  const handleSendMessage = async (content) => {
    if (!selectedDialog || !currentUser) return;

    try {
      const newMessage = await sendMessage({
        recipient: selectedDialog.member.id,
        content
      });

      setMessages(prev => [...prev, newMessage]);

      setDialogs(prev => {
        const updated = prev.map(d => {
          if (d.member.id === selectedDialog.member.id) {
            return {
              ...d,
              last_message: newMessage
            };
          }
          return d;
        });
        return updated.sort((a, b) => {
          const timeA = a.last_message ? new Date(a.last_message.created_at) : 0;
          const timeB = b.last_message ? new Date(b.last_message.created_at) : 0;
          return timeB - timeA;
        });
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLoadMore = () => {
    if (selectedDialog && hasMore && !messagesLoading) {
      loadMessages(selectedDialog.member.id, messagesOffset + 30);
    }
  };

  return (
    <MainLayout>
      <div className="messages-page" data-easytag="id1-react/src/components/Messages/Messages.jsx">
        <div className="messages-container">
          <div className="messages-sidebar">
            <div className="messages-header">
              <h2>Сообщения</h2>
            </div>
            {loading ? (
              <div className="conversations-list">
                <div className="empty-conversations">
                  <p>Загрузка...</p>
                </div>
              </div>
            ) : (
              <DialogList
                dialogs={dialogs}
                selectedDialog={selectedDialog}
                onSelectDialog={handleSelectDialog}
                currentUserId={currentUser?.id}
              />
            )}
          </div>

          <div className="messages-main">
            {selectedDialog && currentUser ? (
              <>
                <ChatWindow
                  messages={messages}
                  member={selectedDialog.member}
                  currentUserId={currentUser.id}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loading={messagesLoading}
                />
                <MessageInput
                  onSend={handleSendMessage}
                  disabled={messagesLoading}
                />
              </>
            ) : (
              <div className="no-conversation-selected">
                <div className="empty-icon">💬</div>
                <h2>Выберите диалог</h2>
                <p>Выберите существующий диалог или начните новый</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Messages;
