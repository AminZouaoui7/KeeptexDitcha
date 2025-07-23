import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common';
import './Hero.css';

const images = [
  '/close-up-person-working-engraving.jpg',
  '/levitating-women-s-scarf-display.jpg',
  '/textiles-sale (1).jpg',
  '/textiles-sale.jpg',
  '/tissue-shop-with-fabrics.jpg',
  '/vibrant-fabric-prints-emerging-from-large-format-printers-design-studio-colorful-textiles-textile-printing-digital-printing.jpg'
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Premium Textile Solutions in Tunisia</h1>
        <p className="hero-subtitle">
          Discover our high-quality fabrics, yarns, and custom textile services for your business needs
        </p>
        <div className="hero-buttons">
          <Link to="/products">
            <Button variant="primary" size="large">
              Explore Products
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="large">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
      <button className="hero-nav-button hero-nav-button-prev" onClick={goToPrevious}>&#10094;</button>
      <button className="hero-nav-button hero-nav-button-next" onClick={goToNext}>&#10095;</button>
    </section>
  );
};

export default Hero;