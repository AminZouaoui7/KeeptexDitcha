import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="footer-logo">
              <span className="logo-text">KeepTex</span>
            </div>
            <p className="footer-description">
              🧵 KeepTex | Textile Factory
              🇹🇳 Fabrication sur mesure | Qualité pro
              📍Ezzahra, Ben Arous – Tunisie
              📩 Contact pro : keeptex77@gmail.com
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/profile.php?id=61574863814372" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://www.instagram.com/keeptex_factory/?hl=fr" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://wa.me/21671123456" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Products</h3>
            <ul className="footer-links">
              <li>
                <Link to="/products?category=fabric">Fabrics</Link>
              </li>
              <li>
                <Link to="/products?category=yarn">Yarns</Link>
              </li>
              <li>
                <Link to="/products?category=accessory">Accessories</Link>
              </li>
              <li>
                <Link to="/products?category=finished">Finished Products</Link>
              </li>
              <li>
                <Link to="/products?category=custom">Custom Orders</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>Ezzahra, Ben Arous – Tunisie</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} />
                <span>+216 71 123 456</span>
                <a href="https://wa.me/21671123456" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>keeptex77@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} KeepTex. All Rights Reserved.
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;