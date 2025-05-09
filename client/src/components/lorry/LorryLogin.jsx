import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import './LorryLogin.css';

const LorryLogin = () => {
  const [formData, setFormData] = useState({
    company: '',
    phone: '',
    username: '',
    password: ''
  });
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      ...formData,
      role: 'lorry'
    });
  };

  return (
    <div className="lorry-login">
      <h1>Lorry Service Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company Name"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit">Login / Register</button>
      </form>
    </div>
  );
};

export default LorryLogin;