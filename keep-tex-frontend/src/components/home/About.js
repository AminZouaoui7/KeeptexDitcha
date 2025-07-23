import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common';
import './About.css';

const About = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-image">
            <div className="image-container">
              {/* Placeholder for image - will need to be added to assets */}
              <div className="image-placeholder"></div>
            </div>
          </div>
          
          <div className="about-content">
            <h2 className="about-title">About KeepTex</h2>
            <div className="about-subtitle">Your Trusted Textile Partner in Tunisia</div>
            
            <p className="about-text">
              KeepTex is a premier textile atelier based in Tunisia, specializing in high-quality 
              fabrics, yarns, and custom textile solutions for businesses worldwide.
            </p>
            
            <p className="about-text">
              With over 15 years of experience in the textile industry, we combine traditional 
              craftsmanship with modern technology to deliver exceptional products that meet 
              international standards.
            </p>
            
            <p className="about-text">
              Our team of skilled artisans and textile experts work closely with clients to 
              understand their specific needs and provide tailored solutions that exceed expectations.
            </p>
            
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Happy Clients</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Projects</div>
              </div>
            </div>
            
            <Link to="/about">
              <Button variant="primary">Learn More About Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;