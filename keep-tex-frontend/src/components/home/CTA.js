import React from 'react';
import { Link } from 'react-router-dom';
import { Button, AdvancedAnimatedSection, ParallaxBackground } from '../common';
import './CTA.css';

const CTA = () => {
  return (
    <ParallaxBackground
      className="cta-section"
      speed={0.5}
      overlay="rgba(0, 0, 0, 0.6)"
    >
      <div className="container">
        <div className="cta-content">
          <AdvancedAnimatedSection
            animationType="slideFromTop"
            duration={1.0}
            delay={0.2}
          >
            <h2 className="cta-title">
              Ready to Transform Your Textile Projects?
            </h2>
          </AdvancedAnimatedSection>
          
          <AdvancedAnimatedSection
            animationType="slideFromLeft"
            duration={1.0}
            delay={0.4}
          >
            <p className="cta-text">
              Partner with KeepTex for premium quality fabrics, yarns, and custom textile solutions. 
              Let's bring your vision to life with our expertise and craftsmanship.
            </p>
          </AdvancedAnimatedSection>
          
          <AdvancedAnimatedSection
            animationType="slideFromBottom"
            duration={1.0}
            delay={0.6}
            staggerChildren={0.2}
          >
            <div className="cta-buttons">
              <Link to="/contact">
                <Button variant="primary" size="large">Request a Quote</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="large">Explore Products</Button>
              </Link>
            </div>
          </AdvancedAnimatedSection>
        </div>
      </div>
    </ParallaxBackground>
  );
};

export default CTA;