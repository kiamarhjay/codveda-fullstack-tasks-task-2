import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token')||null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = () => {
    setToken (null);
  };

    return (
      <div className="app-container">
        {token ? (
          <div className='workspace-layout'>
            <header className='main-header'>
              <h1> Expense Tracker Workspace </h1>
              <button className='logout-btn' onClick={handleLogout}>Log Out</button>
            </header>
            <Dashboard token = {token} />
          </div> 
        ) : (
  
          <div className='auth-wrapper'>
            {showRegister ? (
              <Register setToken={setToken} switchToLogin={() => setShowRegister(false)} />
            ) : (
              <Login setToken={setToken} switchToRegister={() => setShowRegister(true)} />
            )}
          </div>
        )}
      </div>  
  );
}

export default App;