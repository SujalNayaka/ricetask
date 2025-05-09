import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './bookings.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Bookings = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    AOS.init();
    fetchUserBookings();
  }, []);

  // ... (keep all your existing functions unchanged)

  return (
    <>
      <Navbar />
      <div className="heading" data-aos="fade-up">
        <h6>Your agricultural transactions, managed with elegance and precision</h6>
      </div>

      <div className="bookings-wrapper" data-aos="fade-up" data-aos-delay="100">
        {orders && orders.length > 0 ? (
          orders.map((order, index) => (
            <div 
              className="booking-box" 
              key={order._id}
              data-aos="fade-up"
              data-aos-delay={150 * (index + 1)}
            >
              {/* ... (keep all your existing booking box content) */}
            </div>
          ))
        ) : (
          <div className="no-bookings" data-aos="fade-up">
            <h3>No bookings yet</h3>
            <p>Your future agricultural transactions will appear here</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Bookings;