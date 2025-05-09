import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
  const [loginData, setLoginData] = useState({ 
    username: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://ricelink-server.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.message === 'Success') {
        // Store all necessary user data
        sessionStorage.setItem('authToken', data.token || 'dummy-token');
        sessionStorage.setItem('userData', JSON.stringify({
          username: data.loggedin.username,
          email: data.loggedin.mail,
          role: data.loggedin.role
        }));
        
        // Force reload to ensure auth state is picked up
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="login-page" data-aos="fade-in">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to AgriLink</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;