import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sample testimonials data - in a real app, this would come from an API
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Procurement Manager, Fashion Line Inc.',
      content: 'KeepTex has been our trusted supplier for over 5 years. Their fabrics are consistently high quality, and their team is responsive and professional. They\'ve helped us meet tight deadlines without compromising on quality.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Mohammed Al-Farsi',
      position: 'CEO, Elegance Textiles',
      content: 'Working with KeepTex has transformed our production process. Their custom yarn solutions have allowed us to create unique products that stand out in the market. Their attention to detail and commitment to excellence is unmatched.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      position: 'Design Director, Modern Apparel',
      content: 'The quality of fabrics from KeepTex is exceptional. We\'ve been able to elevate our clothing line thanks to their premium materials. Their team understands our vision and helps bring our designs to life.',
      rating: 4,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    }, 8000); // Change testimonial every 8 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handle manual navigation
  const goToTestimonial = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Trusted by businesses around the world
          </p>
        </div>

        <div className="testimonials-container">
          <div className="testimonials-wrapper" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div className="testimonial-card" key={testimonial.id}>
                <div className="quote-icon">
                  <FontAwesomeIcon icon={faQuoteLeft} />
                </div>
                <div className="testimonial-content">{testimonial.content}</div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon 
                      key={i} 
                      icon={faStar} 
                      className={i < testimonial.rating ? 'star-filled' : 'star-empty'} 
                    />
                  ))}
                </div>
                <div className="testimonial-author">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-position">{testimonial.position}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => goToTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;