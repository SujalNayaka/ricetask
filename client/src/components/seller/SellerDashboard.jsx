import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    type: '',
    quantity: '',
    price: '',
    available: false
  });

  useEffect(() => {
    // Load seller's products
    const mockProducts = [
      { id: 1, type: 'Basmati', quantity: 10, price: 500, available: true },
      { id: 2, type: 'Sona Masoori', quantity: 15, price: 450, available: false }
    ];
    setProducts(mockProducts);
  }, []);

  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({ type: '', quantity: '', price: '', available: false });
  };

  const toggleAvailability = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, available: !p.available } : p
    ));
  };

  return (
    <div className="seller-dashboard">
      <header>
        <h1>{user.millName} Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="add-product">
        <h2>Add New Product</h2>
        <input type="text" placeholder="Rice Type" value={newProduct.type} 
          onChange={(e) => setNewProduct({...newProduct, type: e.target.value})} />
        <input type="number" placeholder="Quantity (tons)" value={newProduct.quantity}
          onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} />
        <input type="number" placeholder="Price per ton" value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div className="product-list">
        <h2>Your Products</h2>
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.type}</h3>
            <p>Quantity: {product.quantity} tons</p>
            <p>Price: ₹{product.price}/ton</p>
            <button 
              className={product.available ? 'available' : 'unavailable'}
              onClick={() => toggleAvailability(product.id)}
            >
              {product.available ? 'Mark Unavailable' : 'Mark Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;