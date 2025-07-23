import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import { ReactComponent as Logo } from '../../logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navbarClasses = [
    'navbar',
    scrolled ? 'navbar-scrolled' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navbarClasses}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Logo className="logo-svg" /><span className="navbar-brand-text">KEEP TEX</span>
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>

        <div className={`navbar-menu ${isOpen ? 'is-open' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="navbar-auth">
            {user ? (
              <div className="user-menu">
                <button className="user-menu-button">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{user.name}</span>
                </button>
                <div className="user-dropdown">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-link">
                  Login
                </Link>
                <Link to="/register" className="auth-button">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;