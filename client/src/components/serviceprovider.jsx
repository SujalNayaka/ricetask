import React, { useEffect, useState } from 'react';
import './serviceprovider.css';
import Navbar from './navbar';
import Footer from './footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ServiceProvider = () => {
  const [serviceData, setServiceData] = useState({});
  const [orders, setOrders] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [showLogistics, setShowLogistics] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out'
    });
    fetchServiceData();
    fetchOrders();
  }, []);

  const fetchServiceData = async () => {
    const data = {
      username: sessionStorage.getItem('current-users'),
      mail: sessionStorage.getItem('current-users-mail')
    };

    try {
      const res = await fetch('https://ricetaskserver.vercel.app/signinservices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setServiceData(result.loggedin || {});
    } catch (err) {
      console.error("Error fetching service data:", err);
      showNotification('Failed to load service data', 'error');
    }
  };

  const fetchOrders = async () => {
    const data = {
      serviceusername: sessionStorage.getItem('current-users'),
      servicemail: sessionStorage.getItem('current-users-mail')
    };

    try {
      const res = await fetch('https://ricetaskserver.vercel.app/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setOrders(result || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      showNotification('Failed to load orders', 'error');
    }
  };

  const fetchLogistics = async (order) => {
    try {
      const res = await fetch('https://ricetaskserver.vercel.app/logistics', { 
        headers: { accept: 'application/json' } 
      });
      const result = await res.json();
      setLogistics(result);
      setSelectedOrder(order);
      setShowLogistics(true);
    } catch (err) {
      console.error("Error fetching logistics:", err);
      showNotification('Failed to load logistics providers', 'error');
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const endpoint = action === 'accept' 
        ? 'https://ricetaskserver.vercel.app/acceptorder' 
        : 'https://ricetaskserver.vercel.app/rejectorder';
      
      const data = {
        _id: orderId,
        ...(action === 'accept' && { quantity: parseInt(selectedOrder?.quantity) })
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
      }
    } catch (err) {
      console.error(`Error ${action}ing order:`, err);
      showNotification(`Failed to ${action} order`, 'error');
    }
  };

  const handleBookLogistics = async (logistic) => {
    try {
      const data = {
        servicename: selectedOrder.clientname,
        quantity: selectedOrder.quantity,
        product: selectedOrder.product,
        from: serviceData.address,
        to: selectedOrder.address,
        orderid: selectedOrder._id,
        total: parseInt(logistic.price) * parseInt(selectedOrder.quantity),
        status: 'Pending',
        loginame: logistic.username,
        logimail: logistic.mail
      };

      const res = await fetch('https://ricetaskserver.vercel.app/booklogistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      if (result.message === 'Success') {
        setShowLogistics(false);
        fetchOrders();
        showNotification('Logistics booked successfully', 'success');
      }
    } catch (err) {
      console.error("Error booking logistics:", err);
      showNotification('Failed to book logistics', 'error');
    }
  };

  const updateServiceField = async (field, value) => {
    try {
      const data = {
        _id: serviceData._id,
        [field]: value
      };

      const res = await fetch(`https://ricetaskserver.vercel.app/${field}edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      if (result.message === 'Success') {
        setServiceData(prev => ({ ...prev, [field]: value }));
        showNotification(`${field} updated successfully`, 'success');
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      showNotification(`Failed to update ${field}`, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'var(--success)';
      case 'Rejected': return 'var(--danger)';
      case 'Delivered': return 'var(--primary)';
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

      <div className="service-provider-container" data-aos="fade-up">
        <div className="service-header">
          <h2>Service Provider Dashboard</h2>
          <p>Manage your rice mill service and customer orders</p>
        </div>

        <div className="service-card">
          <h3 className="section-title">Your Service Details</h3>
          
          <div className="service-details">
            <div className="detail-item">
              <span className="detail-label">Mill Name</span>
              <span className="detail-value">{serviceData.servicename || 'N/A'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Description</span>
              <span className="detail-value">{serviceData.description || 'N/A'}</span>
            </div>
            
            <div className="detail-item editable">
              <span className="detail-label">Stock (Tonnes)</span>
              <EditableField
                value={serviceData.stock}
                onSave={(value) => updateServiceField('stock', value)}
              />
            </div>
            
            <div className="detail-item editable">
              <span className="detail-label">Price per Tonne (₹)</span>
              <EditableField
                value={serviceData.price}
                onSave={(value) => updateServiceField('price', value)}
              />
            </div>
          </div>
        </div>

        <div className="orders-section">
          <h3 className="section-title">Customer Orders</h3>
          
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
                      <span>{order.clientname}</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Quantity:</span>
                      <span>{order.quantity} Tonnes</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Bid Price:</span>
                      <span>₹{order.bidprice}/tonne</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Address:</span>
                      <span>{order.address}</span>
                    </div>
                  </div>
                  
                  {order.status === 'Pending' && (
                    <div className="order-actions">
                      <button 
                        className="action-btn accept"
                        onClick={() => handleOrderAction(order._id, 'accept')}
                      >
                        Accept
                      </button>
                      <button 
                        className="action-btn reject"
                        onClick={() => handleOrderAction(order._id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  
                  {order.status === 'Accepted' && order.logistics === 'Pending' && (
                    <button 
                      className="action-btn logistics"
                      onClick={() => fetchLogistics(order)}
                    >
                      Arrange Logistics
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">No orders received yet</div>
          )}
        </div>
      </div>

      {showLogistics && (
        <div className="logistics-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Available Logistics Providers</h3>
              <button onClick={() => setShowLogistics(false)}>×</button>
            </div>
            
            <div className="logistics-list">
              {logistics.length > 0 ? (
                logistics.map(logistic => (
                  <div key={logistic._id} className="logistic-card">
                    <div className="logistic-info">
                      <h4>{logistic.servicename}</h4>
                      <p>{logistic.District}</p>
                      <p>₹{logistic.price}/tonne</p>
                    </div>
                    <button 
                      className="book-btn"
                      onClick={() => handleBookLogistics(logistic)}
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-logistics">No logistics providers available</div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

const EditableField = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    onSave(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="editable-field">
      {isEditing ? (
        <>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{value || 'N/A'}</span>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default ServiceProvider;
