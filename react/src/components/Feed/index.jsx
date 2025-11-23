import React, { useState, useEffect } from 'react';
import { getPosts } from '../../api/posts';
import PostCard from '../Post/PostCard';
import './Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const loadPosts = async (currentOffset = 0, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts({ limit, offset: currentOffset });
      
      if (append) {
        setPosts(prev => [...prev, ...data.results]);
      } else {
        setPosts(data.results);
      }
      
      setHasMore(data.count > currentOffset + data.results.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    loadPosts(newOffset, true);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  if (loading && posts.length === 0) {
    return (
      <div className="feed-container" data-easytag="id1-react/src/components/Feed/index.jsx">
        <div className="feed-loading">Загрузка...</div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="feed-container" data-easytag="id1-react/src/components/Feed/index.jsx">
        <div className="feed-error">{error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed-container" data-easytag="id1-react/src/components/Feed/index.jsx">
        <div className="feed-empty">
          <div className="feed-empty-icon">📰</div>
          <h3>Лента пуста</h3>
          <p>Добавьте друзей или подпишитесь на пользователей, чтобы видеть их публикации</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container" data-easytag="id1-react/src/components/Feed/index.jsx">
      <div className="feed-posts">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post}
            onUpdate={handlePostUpdate}
            onDelete={handlePostDelete}
          />
        ))}
      </div>
      {hasMore && (
        <div className="load-more-container">
          <button 
            className="load-more-button" 
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Feed;
