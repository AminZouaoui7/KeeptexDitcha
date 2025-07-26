import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { AdvancedAnimatedSection } from '../common';
import './Testimonials.css';

const Testimonials = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  
  // Testimonials organized by categories
  const testimonialCategories = [
    {
      title: "Qualité des Produits",
      testimonials: [
        {
          id: 1,
          name: 'Elena Rodriguez',
          position: 'Design Director, Modern Apparel',
          content: 'La qualité des tissus de KeepTex est exceptionnelle. Nous avons pu élever notre ligne de vêtements grâce à leurs matériaux premium. Leur équipe comprend notre vision et aide à donner vie à nos créations.',
          rating: 5,
        },
        {
          id: 2,
          name: 'Jean-Pierre Martin',
          position: 'Responsable Production, Textile Elite',
          content: 'Depuis 3 ans, KeepTex nous fournit des tissus d\'une qualité constante. Leurs fibres résistent parfaitement aux lavages industriels et conservent leurs propriétés dans le temps.',
          rating: 5,
        }
      ]
    },
    {
      title: "Service Client",
      testimonials: [
        {
          id: 3,
          name: 'Sarah Johnson',
          position: 'Procurement Manager, Fashion Line Inc.',
          content: 'KeepTex est notre fournisseur de confiance depuis plus de 5 ans. Leur équipe est réactive et professionnelle. Ils nous ont aidés à respecter des délais serrés sans compromettre la qualité.',
          rating: 5,
        },
        {
          id: 4,
          name: 'Ahmed Ben Ali',
          position: 'Directeur Commercial, Textile Maghreb',
          content: 'Le service après-vente de KeepTex est remarquable. Ils sont toujours disponibles pour résoudre nos problèmes et nous conseiller sur les meilleures solutions pour nos projets.',
          rating: 4,
        }
      ]
    },
    {
      title: "Innovation & Solutions",
      testimonials: [
        {
          id: 5,
          name: 'Mohammed Al-Farsi',
          position: 'CEO, Elegance Textiles',
          content: 'Travailler avec KeepTex a transformé notre processus de production. Leurs solutions de fils personnalisés nous ont permis de créer des produits uniques qui se démarquent sur le marché.',
          rating: 5,
        },
        {
          id: 6,
          name: 'Marie Dubois',
          position: 'Responsable R&D, Innovation Textile',
          content: 'KeepTex nous accompagne dans nos projets les plus innovants. Leur capacité à développer des tissus techniques sur mesure nous permet de rester à la pointe de la technologie textile.',
          rating: 5,
        }
      ]
    }
  ];

  // Auto-rotate categories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((current) => (current === testimonialCategories.length - 1 ? 0 : current + 1));
    }, 10000); // Change category every 10 seconds

    return () => clearInterval(interval);
  }, [testimonialCategories.length]);

  // Handle manual navigation
  const goToCategory = (index) => {
    setActiveCategory(index);
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <AdvancedAnimatedSection
            animationType="slideFromTop"
            duration={1.0}
            delay={0.2}
          >
            <h2 className="section-title">
              What Our Clients Say
            </h2>
          </AdvancedAnimatedSection>
          <AdvancedAnimatedSection
            animationType="slideFromLeft"
            duration={1.0}
            delay={0.4}
          >
            <p className="section-subtitle">
              Trusted by businesses around the world
            </p>
          </AdvancedAnimatedSection>
        </div>

        {/* Category Navigation */}
        <AdvancedAnimatedSection
          animationType="slideFromTop"
          duration={1.0}
          delay={0.6}
          staggerChildren={0.1}
        >
          <div className="category-tabs">
            {testimonialCategories.map((category, index) => (
              <button
                key={index}
                className={`category-tab ${index === activeCategory ? 'active' : ''}`}
                onClick={() => goToCategory(index)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </AdvancedAnimatedSection>

        {/* Active Category Testimonials */}
        <AdvancedAnimatedSection
          animationType="fadeIn"
          duration={1.2}
          delay={0.8}
          staggerChildren={0.2}
        >
          <div className="testimonials-container">
            <div className="testimonials-grid">
              {testimonialCategories[activeCategory].testimonials.map((testimonial, index) => (
                <AdvancedAnimatedSection
                  key={testimonial.id}
                  animationType="fadeInScale"
                  duration={0.8}
                  delay={1.0 + index * 0.2}
                  enableParallax={true}
                  parallaxSpeed={0.3}
                >
                  <div className="testimonial-card">
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
                </AdvancedAnimatedSection>
              ))}
            </div>

            <AdvancedAnimatedSection
              animationType="slideFromBottom"
              duration={0.8}
              delay={1.4}
              staggerChildren={0.1}
            >
              <div className="category-indicators">
                {testimonialCategories.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === activeCategory ? 'active' : ''}`}
                    onClick={() => goToCategory(index)}
                    aria-label={`Voir catégorie ${index + 1}`}
                  />
                ))}
              </div>
            </AdvancedAnimatedSection>
          </div>
        </AdvancedAnimatedSection>
      </div>
    </section>
  );
};

export default Testimonials;