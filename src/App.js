import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';  
import MainPage from './packages/main-page/components/main-page.tsx';
import LoginPanel from './packages/login-page/components/login-panel.tsx';
import SignupPanel from './packages/signup-page/components/signup-panel.tsx';
import DetailPanel from './packages/detail-page/components/detail-panel.tsx';
import NotFoundPage from './packages/not-found/components/not-found.tsx';
import HelloPage from './packages/misc/components/hello-page.tsx';

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

  useEffect(() => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsAuthenticated(regex.test(localStorage.getItem('auth_token')))
  }, [localStorage]);

  if (!isAuthenticated) {
    return (
      <Router>  
        <div className="App">   
          <Routes>  
            <Route exact path='/login' element={<LoginPanel onSuccess={() => {setIsAuthenticated(true)}}/>} />
            <Route exact path='/signup' element={<SignupPanel onSuccess={() => {setIsAuthenticated(true)}}/>} />
            <Route exact path='/' element={<HelloPage/>} />
            <Route path="*" element={<NotFoundPage/>} />  
          </Routes>  
        </div>  
      </Router>  
    );
  }
  return (
    <Router>  
      <div className="App">   
        <Routes>  
          <Route path="/main" element={<MainPage onAuth={setIsAuthenticated}/>} />
          <Route exact path='/login' element={<LoginPanel onSuccess={() => {setIsAuthenticated(true)}}/>} />
          <Route exact path='/signup' element={<SignupPanel onSuccess={() => {setIsAuthenticated(true)}}/>} />
          <Route path="/detail" element={<DetailPanel/>} />
          <Route path="*" element={<NotFoundPage />} />  
        </Routes>  
      </div>  
    </Router>  
  );
}

export default App;