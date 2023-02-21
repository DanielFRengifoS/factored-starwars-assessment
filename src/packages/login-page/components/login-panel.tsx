import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login-panel.scss';

function Login(props) {
  const { onSuccess } = props; 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  function handleEmailChange(event) {
    const { value } = event.target;
    setEmail(value);
    setIsValidEmail(value !== '');
  }
  
  function handlePasswordChange(event) {
    const { value } = event.target;
    setPassword(value);
    setIsValidPassword(value !== '');
  }

  async function handleSubmit(event) {
    event.preventDefault(); 
    setIsLoading(true);
    const user = { email: email, password: password };
    const response = await fetch('http://localhost:8000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user })
    });
  
    if (response.ok) {
      localStorage.setItem('auth_token', email)
      onSuccess()
      navigate('/main')
    } else {
      setErrorMessage('Error validating user')
    }
  
    setIsLoading(false);
  }

  return (
    <div className='login-form-container'>
      <h1 className='login-form-title'>Welcome back!</h1>
      <form onSubmit={handleSubmit} className='login-form'>
        <label className='login-label'>
          Email: 
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => handleEmailChange(e)}
            className='login-input'
          />
        </label>
        <label className='login-label'>
          Password: 
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => handlePasswordChange(e)}
            className='login-input'
          />
        </label>
        {errorMessage && (
          <p>{errorMessage}</p>
        )}
        <button
          type="submit"
          className='login-button'
          disabled={!isValidEmail || !isValidPassword || isLoading}
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className='login-links'>
        <Link to='/signup' className='login-signup'>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;