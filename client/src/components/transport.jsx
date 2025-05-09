import React, { useState, useEffect } from 'react';
import './transport.css';
import Navbar from './navbar';
import Footer from './footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Transport = () => {
  const [transportData, setTransportData] = useState({});
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    lorryno: '',
    currentlocation: ''
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out'
    });
    fetchTransportData();
    fetchOrders();
  }, []);

  const fetchTransportData = async () => {
    const data = {
      username: sessionStorage.getItem('current-users'),
      mail: sessionStorage.getItem('current-users-mail')
    };

    try {
      const res = await fetch('https://ricetaskserver.vercel.app/transportservices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setTransportData(result.loggedin || {});
    } catch (err) {
      console.error('Error fetching transport data:', err);
      showNotification('Failed to load transport data', 'error');
    }
  };

  const fetchOrders = async () => {
    const data = {
      serviceusername: sessionStorage.getItem('current-users'),
      servicemail: sessionStorage.getItem('current-users-mail')
    };

    try {
      const res = await fetch('https://ricetaskserver.vercel.app/logisticorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setOrders(result || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      showNotification('Failed to load orders', 'error');
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const endpoint = action === 'accept'
        ? 'https://ricetaskserver.vercel.app/accepttransportorder'
        : 'https://ricetaskserver.vercel.app/rejecttransportorder';

      const data = {
        _id: orderId,
        regno: formData.lorryno,
        currentlocation: formData.currentlocation
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.message === 'Success') {
        fetchOrders();
        showNotification(`Order ${action === 'accept' ? 'accepted' : 'rejected'} successfully`, 'success');
        setFormData({ lorryno: '', currentlocation: '' });
      }
    } catch (err) {
      console.error(`Error ${action}ing order:`, err);
      showNotification(`Failed to ${action} order`, 'error');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'var(--success)';
      case 'Rejected': return 'var(--danger)';
      case 'Completed': return 'var(--primary)';
      default: return 'var(--warning)';
    }
  };

  return (
    <>
      <Navbar />
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="transport-container" data-aos="fade-up">
        <div className="transport-header">
          <h2>Transport Provider Dashboard</h2>
          <p>Manage your logistics service and customer orders</p>
        </div>

        <div className="transport-card">
          <h3 className="section-title">Your Service Details</h3>
          
          <div className="transport-details">
            <div className="detail-item">
              <span className="detail-label">Service Name</span>
              <span className="detail-value">{transportData.servicename || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Description</span>
              <span className="detail-value">{transportData.description || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">District</span>
              <span className="detail-value">{transportData.District || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Price per Tonne</span>
              <span className="detail-value">₹{transportData.price || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="orders-section">
          <h3 className="section-title">Transport Orders</h3>
          
          {orders.length > 0 ? (
            <div className="orders-grid">
              {orders.map(order => (
                <div key={order._id} className="order-card" data-aos="fade-up">
                  <div className="order-header">
                    <h4>{order.product}</h4>
                    <span 
                      className="order-status" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <div className="detail">
                      <span className="detail-label">Client:</span>
                      <span>{order.servicename}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Quantity:</span>
                      <span>{order.quantity} Tonnes</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">From:</span>
                      <span>{order.from}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">To:</span>
                      <span>{order.to}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Total:</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                  
                  {order.status === 'Pending' && (
                    <div className="order-form">
                      <div className="form-group">
                        <label htmlFor="lorryno">Lorry Registration No</label>
                        <input
                          type="text"
                          id="lorryno"
                          className="form-control"
                          value={formData.lorryno}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="currentlocation">Current Location</label>
                        <input
                          type="text"
                          id="currentlocation"
                          className="form-control"
                          value={formData.currentlocation}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="action-buttons">
                        <button 
                          className="action-btn accept"
                          onClick={() => handleOrderAction(order._id, 'accept')}
                        >
                          Accept Order
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => handleOrderAction(order._id, 'reject')}
                        >
                          Reject Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">No transport orders received yet</div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Transport;
