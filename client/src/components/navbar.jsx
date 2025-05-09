import React, { useState, useEffect } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showBookings, setShowBookings] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const loggedInStatus = sessionStorage.getItem('isloggedin');
    const role = sessionStorage.getItem('user-role');
    
    setIsLoggedIn(loggedInStatus === 'true');
    setUserRole(role);
    setShowBookings(!(role === 'Provider' || role === 'Transport'));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      navigate('/login');
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user-role');
    sessionStorage.setItem('isloggedin', false);
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo" onClick={() => handleNavigation('/')}>
        Agri<span>Link</span>
      </div>
      
      <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        <a 
          className="nav-link" 
          onClick={() => handleNavigation(userRole === 'Provider' ? '/serviceprovider' : userRole === 'Transport' ? '/transport' : '/')}
        >
          Home
        </a>
        
        {showBookings && (
          <a 
            className="nav-link" 
            onClick={() => isLoggedIn ? handleNavigation('/bookings') : alert('Please sign in to view bookings')}
          >
            Your Bookings
          </a>
        )}
        
        <a 
          className="nav-link" 
          onClick={() => isLoggedIn ? handleNavigation('/profile') : alert('Please sign in to view profile')}
        >
          Profile
        </a>
        
        <button 
          className="nav-button" 
          onClick={handleSignIn}
        >
          {isLoggedIn ? 'Logout' : 'Sign In'}
        </button>
      </div>
      
      <div 
        className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={toggleMobileMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
};

export default Navbar;