import React, { useState } from 'react';
import './signup-panel.scss';
import blaster from '../../misc/resources/blaster.wav';
import { useNavigate } from 'react-router-dom';

function SignupPanel(props) {
  
  const { onSuccess } = props; 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidRepeatPassword, setIsValidRepeatPassword] = useState(false);
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [isTouchedPassword, setIsTouchedPassword] = useState(false);
  const [isTouchedRepeatPassword, setIsTouchedRepeatPassword] = useState(false);

  function handleEmailChange(event) {
    const { value } = event.target;
    setEmail(value);
    setIsTouchedEmail(true);
    setIsValidEmail(validateEmail(value));
  }

  function handlePasswordChange(event) {
    const { value } = event.target;
    setPassword(value);
    setIsTouchedPassword(true);
    setIsValidPassword(validatePassword(value));
    setIsValidRepeatPassword(repeatPassword === value);
  }

  function handleRepeatPasswordChange(event) {
    const { value } = event.target;
    setRepeatPassword(value);
    setIsTouchedRepeatPassword(true);
    setIsValidRepeatPassword(value === password);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isValidEmail && isValidPassword && isValidRepeatPassword) {
      const audio = new Audio(blaster);
      audio.play();
      const user = { email: email, password: password };
      await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user })
      })
        .then(response => {
          if (response.ok) {
            localStorage.setItem('auth_token', email)
            onSuccess()
            navigate('/main')
            
          } else {
            alert('Error creating user');
          }
        })
        .catch(error => {
          console.error('Error creating user:', error);
          alert('Error creating user');
        });
    } else {
      alert('Please enter valid email and password');
    }
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    return password.length > 5 && /\S+/.test(password);
  }

  const isEmailInvalid = !isValidEmail && isTouchedEmail;
  const isPasswordInvalid = !isValidPassword && isTouchedPassword;
  const isRepeatPasswordInvalid = (!isValidRepeatPassword && isTouchedRepeatPassword) || (repeatPassword !== password && isTouchedRepeatPassword);

  return (
    <div className="sign-in" data-testid='signin-panel-test'>
      <h1 className="sign-in-title">The Sign-in with you, I hope be</h1>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <label className="sign-in-label">
          Email:
          <input className="sign-in-input" type="email" value={email} onChange={handleEmailChange} data-testid='signin-panel-email-test' placeholder='Enter your email'/>
          {isEmailInvalid && <div className="sign-in-invalid">Invalid, the email is</div>}
        </label>
        <br />
        <label className="sign-in-label">
          Password:
          <input className="sign-in-input" type="password" value={password} onChange={handlePasswordChange} data-testid='signin-panel-password-test' placeholder='Define your password'/>
          {isPasswordInvalid && <div className="sign-in-invalid">Invalid, the password is</div>}
        </label>
        <br />
        <label className="sign-in-label">
          Repeat Password:
          <input className="sign-in-input" type="password" value={repeatPassword} onChange={handleRepeatPasswordChange} data-testid='signin-panel-password-repeat-test' placeholder='Repeat your password'/>
          {isRepeatPasswordInvalid && <div className="sign-in-invalid">Not matching, the passwords are</div>}
        </label>
        <br />
        <button className="sign-in-button" type="submit" disabled={!isValidEmail || !isValidPassword || !isValidRepeatPassword}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignupPanel;