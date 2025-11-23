import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComments } from '../../api/comments';
import './CommentList.css';

function CommentList({ postId }) {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const loadComments = async (currentOffset = 0, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getComments(postId, { limit, offset: currentOffset });
      
      if (append) {
        setComments(prev => [...prev, ...data.results]);
      } else {
        setComments(data.results);
      }
      
      setHasMore(data.count > currentOffset + data.results.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки комментариев');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    loadComments(newOffset, true);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0];
  };

  const handleAuthorClick = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  if (loading && comments.length === 0) {
    return (
      <div className="comment-list" data-easytag="id1-react/src/components/Post/CommentList.jsx">
        <div className="comment-list-loading">Загрузка комментариев...</div>
      </div>
    );
  }

  if (error && comments.length === 0) {
    return (
      <div className="comment-list" data-easytag="id1-react/src/components/Post/CommentList.jsx">
        <div className="comment-list-error">{error}</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="comment-list" data-easytag="id1-react/src/components/Post/CommentList.jsx">
        <div className="comment-list-empty">Комментариев пока нет</div>
      </div>
    );
  }

  return (
    <div className="comment-list" data-easytag="id1-react/src/components/Post/CommentList.jsx">
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-avatar">
            {getInitials(comment.author.username)}
          </div>
          <div className="comment-content">
            <div 
              className="comment-author"
              onClick={() => handleAuthorClick(comment.author.id)}
            >
              {comment.author.first_name && comment.author.last_name
                ? `${comment.author.first_name} ${comment.author.last_name}`
                : comment.author.username}
            </div>
            <div className="comment-text">{comment.content}</div>
            <div className="comment-time">{formatTime(comment.created_at)}</div>
          </div>
        </div>
      ))}
      {hasMore && (
        <button 
          className="load-more-comments"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Показать ещё'}
        </button>
      )}
    </div>
  );
}

export default CommentList;
