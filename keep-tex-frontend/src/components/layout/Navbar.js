import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import { ReactComponent as Logo } from '../../logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef(null);
  
  console.log('Navbar rendering with user:', user);
  console.log('Is authenticated:', isAuthenticated);

  // Close mobile menu and user menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setIsUserMenuOpen(false);
  };
  
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
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
            {/* Ajout de logs de débogage */}
            {console.log('Navbar rendering - user state:', user)}
            {console.log('User type:', typeof user)}
            {console.log('Is user truthy?', !!user)}
            {console.log('User keys:', user ? Object.keys(user) : 'No user')}
            {console.log('Local storage token:', localStorage.getItem('token'))}
            {console.log('Local storage user:', localStorage.getItem('user'))}
            {localStorage.getItem('token') ? (
              <div className="user-menu" ref={userMenuRef}>
                <div className="user-avatar-container">
                  <div className="user-avatar">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                  </div>
                  <button className="burger-menu-button" onClick={toggleUserMenu}>
                    <FontAwesomeIcon icon={isUserMenuOpen ? faTimes : faBars} />
                  </button>
                </div>
                <div className={`user-dropdown ${isUserMenuOpen ? 'is-open' : ''}`}>
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      <div className="dropdown-avatar">
                        {user && user.name ? user.name.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                      </div>
                      <div className="dropdown-user-details">
                        <span className="dropdown-user-name">{user && user.name ? user.name : 'Utilisateur'}</span>
                        <span className="dropdown-user-email">{user && user.email ? user.email : 'Connecté'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-body">
                    {/* // Mon Profil */}
                    <Link to="/orders" className="dropdown-item">
                      <FontAwesomeIcon icon={faShoppingBag} className="dropdown-item-icon" />
                      <span>Mes commandes</span>
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-item-icon" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
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