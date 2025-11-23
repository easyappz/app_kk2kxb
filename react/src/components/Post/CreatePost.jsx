import React, { useState } from 'react';
import { createPost } from '../../api/posts';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleVideoAdd = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => URL.createObjectURL(file));
    setVideos(prev => [...prev, ...newVideos]);
  };

  const handleImageRemove = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoRemove = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && images.length === 0 && videos.length === 0) {
      setError('Пост не может быть пустым');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        content: content.trim()
      };

      if (images.length > 0) {
        postData.images = images;
      }

      if (videos.length > 0) {
        postData.videos = videos;
      }

      const newPost = await createPost(postData);
      
      setContent('');
      setImages([]);
      setVideos([]);
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании поста');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentUserInitials = () => {
    const username = localStorage.getItem('username') || 'U';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="create-post" data-easytag="id1-react/src/components/Post/CreatePost.jsx">
      <form onSubmit={handleSubmit}>
        <div className="create-post-header">
          <div className="create-post-avatar">
            {getCurrentUserInitials()}
          </div>
          <div className="create-post-input-wrapper">
            <textarea
              className="create-post-textarea"
              placeholder="Что у вас нового?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
            />
          </div>
        </div>

        {images.length > 0 && (
          <div className="create-post-media-preview">
            <div className="media-preview-title">📷 Изображения:</div>
            <div className="media-preview-list">
              {images.map((img, index) => (
                <div key={index} className="media-preview-item">
                  🖼️
                  <button
                    type="button"
                    className="media-preview-remove"
                    onClick={() => handleImageRemove(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="create-post-media-preview">
            <div className="media-preview-title">🎬 Видео:</div>
            <div className="media-preview-list">
              {videos.map((video, index) => (
                <div key={index} className="media-preview-item">
                  🎬
                  <button
                    type="button"
                    className="media-preview-remove"
                    onClick={() => handleVideoRemove(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="create-post-actions">
          <label className="media-upload-btn">
            <span>📷</span>
            Фото
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageAdd}
            />
          </label>
          <label className="media-upload-btn">
            <span>🎬</span>
            Видео
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoAdd}
            />
          </label>
          <button
            type="submit"
            className="create-post-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>

        {error && (
          <div className="create-post-error">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default CreatePost;
