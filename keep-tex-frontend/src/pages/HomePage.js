import React, { useEffect } from 'react';
import { 
  Hero, 
  FeaturedProducts, 
  Services, 
  About, 
  Testimonials, 
  Contact, 
  CTA 
} from '../components/home';
import './HomePage.css';

const HomePage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'KeepTex - Premium Textile Solutions in Tunisia';
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <FeaturedProducts />
      <Services />
      <About />
      <Testimonials />
      <CTA />
      <Contact />
    </div>
  );
};

export default HomePage;