import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addLike, removeLike } from '../../api/likes';
import { createRepost } from '../../api/reposts';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import './PostCard.css';

function PostCard({ post, onUpdate, onDelete }) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

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
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleLikeToggle = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (post.is_liked) {
        await removeLike(post.id);
      } else {
        await addLike(post.id);
      }
      
      const updatedPost = {
        ...post,
        is_liked: !post.is_liked,
        likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
      };
      onUpdate(updatedPost);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async () => {
    if (isReposting) return;
    
    setIsReposting(true);
    try {
      await createRepost(post.id);
      const updatedPost = {
        ...post,
        reposts_count: post.reposts_count + 1
      };
      onUpdate(updatedPost);
    } catch (error) {
      console.error('Error reposting:', error);
    } finally {
      setIsReposting(false);
    }
  };

  const handleAuthorClick = () => {
    navigate(`/profile/${post.author.id}`);
  };

  const handleCommentAdded = () => {
    const updatedPost = {
      ...post,
      comments_count: post.comments_count + 1
    };
    onUpdate(updatedPost);
  };

  const getImageClass = () => {
    if (!post.images || post.images.length === 0) return '';
    if (post.images.length === 1) return 'single';
    if (post.images.length === 2) return 'double';
    return 'multiple';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0];
  };

  return (
    <div className="post-card" data-easytag="id1-react/src/components/Post/PostCard.jsx">
      <div className="post-header">
        <div className="post-author" onClick={handleAuthorClick}>
          <div className="post-avatar">
            {getInitials(post.author.username)}
          </div>
          <div className="post-author-info">
            <div className="post-author-name">
              {post.author.first_name && post.author.last_name
                ? `${post.author.first_name} ${post.author.last_name}`
                : post.author.username}
            </div>
            <div className="post-time">{formatTime(post.created_at)}</div>
          </div>
        </div>
        <button className="post-menu-button">⋯</button>
      </div>

      <div className="post-content">
        {post.is_repost && (
          <div className="post-repost-info">
            🔄 Репост
          </div>
        )}
        
        {post.content && (
          <div className="post-text">{post.content}</div>
        )}

        {post.original_post && (
          <div className="post-original">
            <div className="post-original-author">
              {post.original_post.author.first_name} {post.original_post.author.last_name}
            </div>
            <div className="post-original-content">
              {post.original_post.content}
            </div>
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="post-media">
            <div className={`post-images ${getImageClass()}`}>
              {post.images.map((image, index) => (
                <div key={index} className="post-image">
                  🖼️
                </div>
              ))}
            </div>
          </div>
        )}

        {post.videos && post.videos.length > 0 && (
          <div className="post-media">
            <div className="post-videos">
              {post.videos.map((video, index) => (
                <div key={index} className="post-video">
                  🎬
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="post-stats">
        <span className="post-stat">❤️ {post.likes_count}</span>
        <span className="post-stat">💬 {post.comments_count}</span>
        <span className="post-stat">🔄 {post.reposts_count}</span>
      </div>

      <div className="post-actions">
        <button 
          className={`post-action-btn ${post.is_liked ? 'liked' : ''}`}
          onClick={handleLikeToggle}
          disabled={isLiking}
        >
          <span>{post.is_liked ? '❤️' : '🤍'}</span>
          {post.is_liked ? 'Нравится' : 'Лайк'}
        </button>
        <button 
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span>💬</span>
          Комментировать
        </button>
        <button 
          className="post-action-btn"
          onClick={handleRepost}
          disabled={isReposting}
        >
          <span>🔄</span>
          {isReposting ? 'Репост...' : 'Поделиться'}
        </button>
      </div>

      <div className="post-comments-section">
        {post.comments_count > 0 && !showComments && (
          <button 
            className="toggle-comments-btn"
            onClick={() => setShowComments(true)}
          >
            Показать комментарии ({post.comments_count})
          </button>
        )}
        
        {showComments && (
          <>
            <CommentForm 
              postId={post.id} 
              onCommentAdded={handleCommentAdded}
            />
            <CommentList postId={post.id} />
          </>
        )}
      </div>
    </div>
  );
}

export default PostCard;
