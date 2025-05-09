import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import './BuyerLogin.css';

const BuyerLogin = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    username: '',
    password: ''
  });
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      ...formData,
      role: 'buyer'
    });
  };

  return (
    <div className="buyer-login">
      <h1>Buyer Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
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

export default BuyerLogin;