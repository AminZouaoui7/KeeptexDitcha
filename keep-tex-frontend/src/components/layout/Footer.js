import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
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
              A leading textile atelier in Tunisia, specializing in high-quality fabrics, 
              custom designs, and professional textile services for local and international clients.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faLinkedin} />
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
                <span>123 Textile Street, Tunis, Tunisia</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} />
                <span>+216 71 123 456</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>info@keeptex.tn</span>
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