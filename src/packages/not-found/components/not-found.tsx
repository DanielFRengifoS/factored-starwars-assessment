import React from 'react';
import { Link } from 'react-router-dom';

import './not-found.scss';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-title">
        <h1>404 Error: These aren't the droids you're looking for.</h1>
        <p>Sorry, the page you're looking for does not exist.</p>
      </div>
      <div className="not-found-return">
        <Link to="/" className="not-found-button">
          Back to homepage
        </Link>
        <Link to="/login" className="not-found-button">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;