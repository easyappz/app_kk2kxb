import React, { useState, useEffect } from 'react';
import { getPosts } from '../../api/posts';
import PostCard from '../Post/PostCard';
import './ProfilePosts.css';

function ProfilePosts({ memberId, isOwnProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, [memberId]);

  const fetchPosts = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentOffset = loadMore ? offset : 0;
      const response = await getPosts({
        author: memberId,
        limit,
        offset: currentOffset
      });

      const newPosts = response.results || [];

      if (loadMore) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(newPosts.length === limit);
      setOffset(currentOffset + newPosts.length);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Не удалось загрузить посты');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(true);
    }
  };

  const handlePostUpdate = () => {
    setOffset(0);
    fetchPosts(false);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="profile-section" data-easytag="id3-react/src/components/Profile/ProfilePosts.jsx">
        <h2>Публикации</h2>
        <div className="posts-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка постов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-section" data-easytag="id3-react/src/components/Profile/ProfilePosts.jsx">
        <h2>Публикации</h2>
        <div className="posts-error">
          <p>{error}</p>
          <button onClick={() => fetchPosts(false)}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-section" data-easytag="id3-react/src/components/Profile/ProfilePosts.jsx">
      <h2>Публикации</h2>

      {posts.length === 0 ? (
        <div className="posts-empty">
          <div className="empty-icon">📝</div>
          <p>{isOwnProfile ? 'У вас пока нет публикаций' : 'У пользователя пока нет публикаций'}</p>
          {isOwnProfile && (
            <p className="empty-hint">Поделитесь своими мыслями на главной странице</p>
          )}
        </div>
      ) : (
        <>
          <div className="profile-posts-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} />
            ))}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Загрузка...' : 'Показать ещё'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePosts;