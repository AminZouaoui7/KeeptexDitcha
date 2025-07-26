import React from 'react';
import { Link } from 'react-router-dom';
import { Button, AdvancedAnimatedSection } from '../common';
import './About.css';

const About = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-grid">
          <AdvancedAnimatedSection
            animationType="slideFromRight"
            duration={1.0}
            delay={0}
            parallax={true}
            parallaxSpeed={0.3}
            className="about-image"
          >
            <div className="image-container">
              {/* Placeholder for image - will need to be added to assets */}
              <div className="image-placeholder"></div>
            </div>
          </AdvancedAnimatedSection>
          
          <div className="about-content">
            <AdvancedAnimatedSection
              animationType="slideFromTop"
              duration={1.0}
              delay={0.2}
            >
              <h2 className="about-title">
                KeepTex
              </h2>
            </AdvancedAnimatedSection>
            
            <AdvancedAnimatedSection
              animationType="slideFromLeft"
              duration={1.0}
              delay={0.4}
            >
              <div className="about-subtitle">
                🧵 KeepTex | Textile Factory
              </div>
            </AdvancedAnimatedSection>
            
            <AdvancedAnimatedSection
              animationType="slideFromLeft"
              duration={1.0}
              delay={0.6}
              staggerChildren={0.1}
            >
              <p className="about-text">
                🇹🇳 Fabrication sur mesure | Qualité pro
              </p>
              
              <p className="about-text">
                📍Ezzahra, Ben Arous – Tunisie
              </p>
              
              <p className="about-text">
                📩 Contact pro : keeptex77@gmail.com
              </p>
            </AdvancedAnimatedSection>
            
            <AdvancedAnimatedSection
              animationType="fadeInScale"
              duration={1.2}
              delay={1.0}
              staggerChildren={0.1}
            >
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
            </AdvancedAnimatedSection>
            
            <AdvancedAnimatedSection
              animationType="slideFromBottom"
              duration={1.0}
              delay={1.4}
            >
              <Link to="/contact">
                <Button variant="primary">Contact Us</Button>
              </Link>
            </AdvancedAnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;