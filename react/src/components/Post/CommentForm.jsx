import React, { useState } from 'react';
import { addComment } from '../../api/comments';
import './CommentForm.css';

function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Комментарий не может быть пустым');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addComment(postId, { content: content.trim() });
      setContent('');
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при добавлении комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentUserInitials = () => {
    const username = localStorage.getItem('username') || 'U';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div data-easytag="id1-react/src/components/Post/CommentForm.jsx">
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-avatar">
          {getCurrentUserInitials()}
        </div>
        <div className="comment-form-input-wrapper">
          <input
            type="text"
            className="comment-form-input"
            placeholder="Написать комментарий..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="comment-form-submit"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
      {error && (
        <div className="comment-form-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default CommentForm;
