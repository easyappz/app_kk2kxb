import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page" data-easytag="id1-react/src/components/NotFound/NotFound.jsx">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Страница не найдена</h1>
        <p>К сожалению, запрашиваемая страница не существует</p>
        <Link to="/" className="back-home-button">
          <span>🏠</span>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default NotFound;