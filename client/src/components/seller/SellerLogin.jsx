import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import './SellerLogin.css';

const SellerLogin = () => {
  const [formData, setFormData] = useState({
    millName: '',
    city: '',
    location: '',
    username: '',
    password: ''
  });
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      ...formData,
      role: 'seller',
      location: { lat: 17.1234, lng: 78.5678 } // Mock GPS
    });
  };

  return (
    <div className="seller-login">
      <h1>Rice Miller Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mill Name"
          value={formData.millName}
          onChange={(e) => setFormData({...formData, millName: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
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

export default SellerLogin;