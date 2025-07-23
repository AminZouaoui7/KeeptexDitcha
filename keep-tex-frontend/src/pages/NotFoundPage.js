import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';
import './NotFoundPage.css';

const NotFoundPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Page Not Found - KeepTex';
  }, []);

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button variant="primary">Return to Homepage</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;