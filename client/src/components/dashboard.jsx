import React from 'react';
import { FaShoppingCart, FaDollarSign, FaUsers, FaBoxes } from 'react-icons/fa';
import './dashboard.css';

const Dashboard = () => {
  const userData = JSON.parse(sessionStorage.getItem('userData'));

  return (
    <div className="dashboard-container">
      <h1>Welcome, {userData?.username || 'User'}</h1>
      <div className="stats-grid">
        <div className="stat-card" data-aos="fade-up">
          <div className="stat-icon"><FaShoppingCart /></div>
          <div className="stat-content">
            <h3>1,245</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card" data-aos="fade-up">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-content">
            <h3>$34,245</h3>
            <p>Revenue</p>
          </div>
        </div>
        <div className="stat-card" data-aos="fade-up">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-content">
            <h3>345</h3>
            <p>Customers</p>
          </div>
        </div>
        <div className="stat-card" data-aos="fade-up">
          <div className="stat-icon"><FaBoxes /></div>
          <div className="stat-content">
            <h3>42</h3>
            <p>Products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;