import React from 'react';
import { Link } from 'react-router-dom';
import './hello-page.scss';

const HelloPage = () => {
  return (
    <div className="main-page">
      <h1 className="title">Welcome to the Factored Assessment</h1>
      <p className="subtitle">May the F be with you!</p>
      <p className="subtitle">F... is for FACTORED</p>
      <div className="links">
        <Link to="/login" className="login-link">
          Login
        </Link>
        <Link to="/signup" className="signup-link">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default HelloPage;