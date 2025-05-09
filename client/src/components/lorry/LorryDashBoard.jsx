import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import './LorryDashboard.css';

const LorryDashboard = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [lorryNumber, setLorryNumber] = useState('');

  useEffect(() => {
    // Mock orders
    const mockOrders = [
      { 
        id: 1, 
        from: 'Siddipet Rice Mill #1', 
        to: 'Hyderabad Buyer', 
        quantity: 5, 
        type: 'Basmati',
        status: 'pending'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const acceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'accepted', lorryNumber } : order
    ));
    alert('Order accepted! Proceed to pickup location.');
  };

  return (
    <div className="lorry-dashboard">
      <header>
        <h1>Lorry Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="lorry-info">
        <input
          type="text"
          placeholder="Enter your lorry number"
          value={lorryNumber}
          onChange={(e) => setLorryNumber(e.target.value)}
        />
      </div>

      <div className="orders-list">
        <h2>Available Orders</h2>
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <h3>Order #{order.id}</h3>
            <p>From: {order.from}</p>
            <p>To: {order.to}</p>
            <p>Type: {order.type}</p>
            <p>Quantity: {order.quantity} tons</p>
            
            {order.status === 'pending' ? (
              <button onClick={() => acceptOrder(order.id)} disabled={!lorryNumber}>
                Accept Order
              </button>
            ) : (
              <div className="order-accepted">
                <p>Status: Accepted</p>
                <p>Lorry: {order.lorryNumber}</p>
                <button>Navigate to Pickup</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LorryDashboard;