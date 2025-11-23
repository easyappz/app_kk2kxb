import React from 'react';
import MainLayout from '../Layout/MainLayout';
import CreatePost from '../Post/CreatePost';
import Feed from '../Feed';
import './Home.css';

function Home() {
  const handlePostCreated = () => {
    window.location.reload();
  };

  return (
    <MainLayout>
      <div className="home-page" data-easytag="id1-react/src/components/Home/index.jsx">
        <CreatePost onPostCreated={handlePostCreated} />
        <Feed />
      </div>
    </MainLayout>
  );
}

export { Home };
