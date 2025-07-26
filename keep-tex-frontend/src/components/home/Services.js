import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdvancedAnimatedSection } from '../common';
import {
  faArrowRight,
  faPrint,
  faTshirt,
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import './Services.css';
const Services = () => {
  const staticServices = [
    {
      _id: '1',
      title: 'PRINT SERVICE',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mollis tempus tellus, eu imperdiet velit auctor condimentum. Sed eleifend ipsum id malesuada semper, tortor purus tempor purus, non dignissim urna est quis tellus.',
      icon: faPrint
    },
    {
      _id: '2',
      title: 'T-SHIRT DESIGN',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mollis tempus tellus, eu imperdiet velit auctor condimentum. Sed eleifend ipsum id malesuada semper, tortor purus tempor purus, non dignissim urna est quis tellus.',
      icon: faTshirt
    },
    {
      _id: '3',
      title: 'PHOTOPRINT',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mollis tempus tellus, eu imperdiet velit auctor condimentum. Sed eleifend ipsum id malesuada semper, tortor purus tempor purus, non dignissim urna est quis tellus.',
      icon: faCamera
    }
  ];

  const services = staticServices;

  // Only display up to 6 services on the homepage
  const displayedServices = services.slice(0, 6);

  return (
    <section className="services-section">
      <div className="container">
        <div className="section-header">
          <AdvancedAnimatedSection
            animationType="slideFromTop"
            duration={1.0}
            delay={0}
          >
            <h2 className="section-title">
              Our Services
            </h2>
          </AdvancedAnimatedSection>
          
          <AdvancedAnimatedSection
            animationType="slideFromLeft"
            duration={1.0}
            delay={0.2}
          >
            <p className="section-subtitle">
              Professional textile services tailored to your business needs
            </p>
          </AdvancedAnimatedSection>
        </div>

        <AdvancedAnimatedSection
          animationType="fadeIn"
          duration={1.0}
          delay={0.4}
          staggerChildren={0.1}
          className="services-grid"
        >
          {displayedServices.map((service, index) => (
            <AdvancedAnimatedSection
              key={service._id}
              animationType="fadeInScale"
              duration={1.0}
              delay={0.1 * index}
              className="service-card"
            >
              <div className="service-icon">
                {service.icon && (
                  <FontAwesomeIcon icon={service.icon} />
                )}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">
                {service.description.substring(0, 120)}...
              </p>
              <Link to={`/services/${service._id}`} className="service-link">
                Learn More <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </AdvancedAnimatedSection>
          ))}
        </AdvancedAnimatedSection>

        <AdvancedAnimatedSection
          animationType="slideFromBottom"
          duration={1.0}
          delay={0.8}
          className="view-all-container"
        >
          <Link to="/services" className="view-all-link">
            View All Services
          </Link>
        </AdvancedAnimatedSection>
      </div>
    </section>
  );
};

export default Services;