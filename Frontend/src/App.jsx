import React, { useState, useEffect } from 'react';
import './App.css';

import LogSearch from './LogSearch';
import Login from './Login';
import Registration from './Registration';

const App = () => {
  const storedUser = localStorage.getItem('loggedInUser');
  const [loggedIn, setLoggedIn] = useState(!!storedUser); // Check if a user is stored
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(true); // State to manage which component to display

  const handleLogin = (user) => {
    setLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedIn(false);
    setUsername('');
  };

  useEffect(() => {
    if (storedUser) {
      setUsername(storedUser);
    }
  }, [storedUser]);

  const toggleView = (showLoginState) => {
    setShowLogin(showLoginState); // Toggle between Login and Registration views
  };

  return (
    <div className="App">
      <div className="top-left">
        {loggedIn ? null : (
          <p>
            {showLogin ? (
              <span>
                Don't have an account? <button onClick={() => toggleView(false)}>Register</button>
              </span>
            ) : (
              <span>
                Already have an account? <button onClick={() => toggleView(true)}>Login</button>
              </span>
            )}
          </p>
        )}
      </div>
      {loggedIn ? (
        <div>
          <button
            onClick={handleLogout}
            className="m-5 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Logout
          </button>
          <LogSearch username={username} />
        </div>
      ) : showLogin ? (
        <div>
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <div>
          <Registration onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
};

export default App;
