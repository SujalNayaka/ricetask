import React from 'react';
import './footer.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out'
    });
  }, []);

  return (
    <footer className="site-footer" data-aos="fade-up">
      <div className="footer-content">
        <h2 data-aos="fade-up" data-aos-delay="100">
          © 2025 <span className="brand-name">AgriLink Pro</span>. All rights reserved.
        </h2>
        <div className="footer-links" data-aos="fade-up" data-aos-delay="200">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact Us</a>
          <a href="/about">About</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;