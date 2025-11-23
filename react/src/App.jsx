import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import { Home } from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Friends from './components/Friends';
import Messages from './components/Messages/Messages';
import Search from './components/Search/Search';
import Settings from './components/Settings/Settings';
import NotFound from './components/NotFound/NotFound';

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes([
        '/',
        '/login',
        '/register',
        '/profile/:id',
        '/friends',
        '/messages',
        '/search',
        '/settings',
        '/404'
      ]);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
