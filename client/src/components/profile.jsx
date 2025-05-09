import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out' });
    
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || ''
    });
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const response = await fetch('https://ricelink-server.onrender.com/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      sessionStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-card" data-aos="fade-up">
        <div className="profile-header">
          <h2>My Profile</h2>
          <div className="profile-actions">
            {editMode ? (
              <>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            )}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-picture">
            <div className="avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {editMode && <button className="change-photo-btn">Change Photo</button>}
          </div>
          
          <div className="profile-details">
            {editMode ? (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{user.name || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{user.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{user.address || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{user.role}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;