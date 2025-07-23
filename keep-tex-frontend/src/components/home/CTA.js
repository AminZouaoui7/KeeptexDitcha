import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-overlay"></div>
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Textile Projects?</h2>
          <p className="cta-text">
            Partner with KeepTex for premium quality fabrics, yarns, and custom textile solutions. 
            Let's bring your vision to life with our expertise and craftsmanship.
          </p>
          <div className="cta-buttons">
            <Link to="/contact">
              <Button variant="primary" size="large">Request a Quote</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="large">Explore Products</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;