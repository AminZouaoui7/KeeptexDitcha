import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, AdvancedAnimatedSection, ParallaxBackground } from '../common';

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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Précharger les images pour des transitions plus fluides
  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      
      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Erreur lors du préchargement des images:', error);
        setImagesLoaded(true); // Continuer même en cas d'erreur
      }
    };
    
    preloadImages();
  }, []);

  useEffect(() => {
    // Ne démarrer le carousel que lorsque les images sont préchargées
    if (imagesLoaded) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2500); // Change image every 2.5 seconds
      return () => clearInterval(interval);
    }
  }, [imagesLoaded]);



  return (
    <ParallaxBackground
      backgroundImage={images[currentImageIndex]}
      speed={0.5}
      className="hero"
      overlay={false}
      overlayOpacity={0}
    >
      <div className="hero-content">
        <AdvancedAnimatedSection
          animationType="slideFromTop"
          duration={1.0}
          delay={0}
        >
          <h1 className="hero-title">
            Premium Textile Solutions in Tunisia
          </h1>
        </AdvancedAnimatedSection>
        
        <AdvancedAnimatedSection
          animationType="slideFromLeft"
          duration={1.0}
          delay={0.2}
        >
          <p className="hero-subtitle">
            Discover our high-quality fabrics, yarns, and custom textile services for your business needs
          </p>
        </AdvancedAnimatedSection>
        
        <AdvancedAnimatedSection
          animationType="slideFromBottom"
          duration={1.0}
          delay={0.4}
        >
          <div className="hero-buttons">
            <Link to="/products">
              <Button variant="primary" size="large">
                Explore Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="primary" size="large">
                Contact Us
              </Button>
            </Link>
          </div>
        </AdvancedAnimatedSection>
      </div>
      

    </ParallaxBackground>
  );
};

export default Hero;