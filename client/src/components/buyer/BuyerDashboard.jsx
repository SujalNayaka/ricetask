import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mills, setMills] = useState([]);
  const [bidPrice, setBidPrice] = useState('');

  useEffect(() => {
    // Mock API call to get mills
    const mockMills = [
      { id: 1, district: 'Siddipet', type: 'Basmati', quantity: 10, price: 525, commission: 25 },
      { id: 2, district: 'Karimnagar', type: 'Sona Masoori', quantity: 15, price: 472.5, commission: 22.5 }
    ];
    setMills(mockMills);
  }, []);

  const handleBid = (millId) => {
    alert(`Bid of ₹${bidPrice} submitted to ${mills.find(m => m.id === millId).district} Rice Mill`);
    // In real app, this would notify sellers
  };

  return (
    <div className="buyer-dashboard">
      <header>
        <h1>Welcome, {user.name}</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="search-section">
        <input 
          type="text" 
          placeholder="Search rice type..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity needed (tons)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button>Search</button>
      </div>

      <div className="mills-list">
        {mills.filter(mill => 
          mill.type.toLowerCase().includes(searchTerm.toLowerCase()) && 
          mill.quantity >= quantity
        ).map(mill => (
          <div key={mill.id} className="mill-card">
            <h3>{mill.district} Rice Mill #{mill.id}</h3>
            <p>Type: {mill.type}</p>
            <p>Available: {mill.quantity} tons</p>
            <p>Price: ₹{mill.price}/ton (incl. ₹{mill.commission} commission)</p>
            
            <div className="bid-section">
              <input
                type="number"
                placeholder="Your bid price"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
              />
              <button onClick={() => handleBid(mill.id)}>Place Bid</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;