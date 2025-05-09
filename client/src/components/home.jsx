import React, { useEffect, useState } from 'react';
import './home.css';
import Navbar from './navbar';
import Footer from './footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [search, setSearch] = useState('');
  const [searchquant, setSearchquant] = useState('');
  const [allproviders, setAllproviders] = useState([]);
  const [userdet, setUserdet] = useState({ loogedin: {} });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out'
    });
    
    if (sessionStorage.getItem('isloggedin') === 'true') {
      handlefetchproviders();
      handleuser();
    } else {
      showNotification('Please sign in to use the service', 'warning');
    }
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleuser = async () => {
    const data = {
      username: sessionStorage.getItem('current-users'),
      mail: sessionStorage.getItem('current-users-mail')
    };
    
    try {
      const res = await fetch('https://ricelink-server.onrender.com/loginusers', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const data1 = await res.json();
      setUserdet({ loogedin: data1.loggedin });
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  const handlefetchproviders = async () => {
    try {
      const allproviders = await fetch('https://ricelink-server.onrender.com/allproviders', { 
        headers: { accept: 'application/json' } 
      });
      const allproviders1 = await allproviders.json();
      setAllproviders(allproviders1);
    } catch (error) {
      console.error("Error fetching providers", error);
    }
  };

  const handlebid = async (e) => {
    if (!searchquant) {
      showNotification('Please enter quantity', 'error');
      return;
    }

    const data = {
      address: userdet.loogedin.address,
      district: e.target.closest('.milldatas').querySelector('.district').innerText,
      product: search || e.target.closest('.milldatas').querySelector('.productname').innerText,
      quantity: searchquant,
      serviceusername: e.target.closest('.milldatas').querySelector('.servicename').innerText,
      servicemail: e.target.closest('.milldatas').querySelector('.servicemail').innerText,
      servicephone: e.target.closest('.milldatas').querySelector('.servicephone').innerText,
      clientname: userdet.loogedin.username,
      clientphone: userdet.loogedin.phone || 'Contact details not provided',
      clientmail: userdet.loogedin.mail,
      status: parseInt(e.target.closest('.milldatas').querySelector('.serviceprice').innerText) <= parseInt(document.getElementById('bidprice').value) ? 'Auto Accepted' : 'Pending',
      bidprice: document.getElementById('bidprice').value,
      paymentstatus: 'Pending',
      logistics: 'Pending',
      code: 'No code'
    };

    try {
      const res = await fetch('https://ricelink-server.onrender.com/bookings', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      const data1 = await res.json();
      if (data1.message === 'Success') {
        showNotification('Bid placed successfully!', 'success');
        document.getElementById('bidprice').value = '';
      } else {
        showNotification('Failed to place bid', 'error');
      }
    } catch (error) {
      showNotification('Network error occurred', 'error');
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

      <div className="heading" data-aos="fade-down">
        <h4>AgriLink Marketplace</h4>
        <h6>Connecting farmers with premium rice mills nationwide</h6>
      </div>

      <div className="search" data-aos="fade-up">
        <div className="search-inputs">
          <input 
            placeholder="Search product (e.g. Basmati, Brown Rice)" 
            type="text" 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <input 
            placeholder="Quantity (in Tonnes)" 
            type="Number" 
            onChange={(e) => setSearchquant(e.target.value)} 
          />
        </div>
        
        <h3>Available Rice Mills</h3>
        
        {allproviders
          .filter((item) => {
            const matchesSearch = search.toLowerCase() === '' || 
              item.description.toLowerCase().includes(search.toLowerCase());
            const matchesQuantity = searchquant === '' || 
              item.stock >= parseInt(searchquant);
            return matchesSearch && matchesQuantity;
          })
          .map((provider, index) => (
            <div 
              className="milldatas" 
              key={provider.username}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="milldetails">
                <div className="district" style={{ display: 'none' }}>{provider.District}</div>
                <div className="servicename" style={{ display: 'none' }}>{provider.username}</div>
                <div className="servicemail" style={{ display: 'none' }}>{provider.mail}</div>
                <div className="serviceprice" style={{ display: 'none' }}>{provider.price}</div>
                <div className="servicephone" style={{ display: 'none' }}>{provider.phone}</div>
                <div className="productname" style={{ display: 'none' }}>{provider.description}</div>
                
                <div className="milldata">
                  <strong>Mill Name:</strong> {provider.servicename}
                </div>
                <div className="milldata">
                  <strong>Product:</strong> {provider.description}
                </div>
                <div className="milldata">
                  <strong>Price:</strong> ₹{provider.price + (provider.price * 0.05)}/tonne
                </div>
                <div className="milldata">
                  <strong>Stock:</strong> {provider.stock} tonnes
                </div>
              </div>

              <div className="bidding">
                <input 
                  type="Number" 
                  id="bidprice" 
                  placeholder="Your bid price per tonne" 
                />
                <button onClick={handlebid}>Place Bid</button>
              </div>
            </div>
          ))
        }
      </div>

      <Footer />
    </>
  );
};

export default Home;