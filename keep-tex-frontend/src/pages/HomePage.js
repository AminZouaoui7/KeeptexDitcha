import React, { useEffect } from 'react';
import { Hero, FeaturedProducts, Services, About, Testimonials, CTA, Contact } from '../components/home';
import { AnimatedSection, SectionDivider } from '../components/common';
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
      <AnimatedSection variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}>
        <Hero />
      </AnimatedSection>
      
      <SectionDivider variant="default" delay={0.1} />
      
      <AnimatedSection variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} delay={0.2}>
        <FeaturedProducts />
      </AnimatedSection>
      
      <SectionDivider variant="wave" delay={0.3} />
      
      <AnimatedSection variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} delay={0.4}>
        <Services />
      </AnimatedSection>
      
      <SectionDivider variant="gradient" delay={0.5} />
      
      <AnimatedSection variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} delay={0.6}>
        <About />
      </AnimatedSection>
      
      <SectionDivider variant="default" delay={0.7} />
      
      <AnimatedSection variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} delay={0.8}>
        <Testimonials />
      </AnimatedSection>
      
      <SectionDivider variant="wave" delay={0.9} />
      
      <AnimatedSection variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} delay={1.0}>
        <CTA />
      </AnimatedSection>
      
      <SectionDivider variant="gradient" delay={1.1} />
      
      <AnimatedSection variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} delay={1.2}>
        <Contact />
      </AnimatedSection>
    </div>
  );
};

export default HomePage;