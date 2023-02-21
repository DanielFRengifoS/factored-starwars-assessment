import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPanel from './signup-panel';
import { BrowserRouter as Router } from 'react-router-dom';

describe('SignupPanel', () => {
  test('renders the component', () => {
    render(<Router><SignupPanel /></Router>);
    expect(screen.getByTestId('signin-panel-test')).toBeInTheDocument();
  });  

  test('displays invalid email message when email is invalid', () => {
    render(<Router><SignupPanel /></Router>);
    const emailInput = screen.getByTestId('signin-panel-email-test');
    userEvent.type(emailInput, 'email.test');
    fireEvent.blur(emailInput);
    expect(screen.getByText('Invalid, the email is')).toBeInTheDocument();
  });

  test('displays invalid password message when password is invalid', () => {
    render(<Router><SignupPanel /></Router>);
    const passwordInput = screen.getByTestId('signin-panel-password-test');
    userEvent.type(passwordInput, '123');
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Invalid, the password is')).toBeInTheDocument();
  });

  test('displays invalid repeat password message when repeat password does not match password', () => {
    render(<Router><SignupPanel /></Router>);
    const passwordInput = screen.getByTestId('signin-panel-password-test');
    userEvent.type(passwordInput, 'password123');
    const repeatPasswordInput = screen.getByTestId('signin-panel-password-repeat-test');
    userEvent.type(repeatPasswordInput, 'password456');
    fireEvent.blur(repeatPasswordInput);
    expect(screen.getByText('Not matching, the passwords are')).toBeInTheDocument();
  });

  test('submits form when all inputs are valid', () => {
    const audioMock = jest.fn();
    window.HTMLMediaElement.prototype.play = audioMock;
    render(<Router><SignupPanel /></Router>);
    const emailInput = screen.getByTestId('signin-panel-email-test');
    userEvent.type(emailInput, 'email.test@example.com');
    const passwordInput = screen.getByTestId('signin-panel-password-test');
    userEvent.type(passwordInput, 'password');
    const repeatPasswordInput = screen.getByTestId('signin-panel-password-repeat-test');
    userEvent.type(repeatPasswordInput, 'password');
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    expect(audioMock).toHaveBeenCalled();
  });
});
