import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdvancedAnimatedSection, Button, SectionDivider, Modal, OrderTypeSelector, Alert } from '../components/common';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  faPencilRuler,
  faRulerCombined,
  faCut,
  faTshirt,
  faSprayCan,
  faClipboardCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './ServicesPage.css';

function ServicesPage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'Nos Services - KeepTex';
  }, []);

  const handleOrderButtonClick = () => {
    if (isAuthenticated()) {
      setIsOrderModalOpen(true);
    } else {
      setShowLoginAlert(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
  };

  const handleSelectOrderType = (type) => {
    console.log(`Type de commande sélectionné: ${type}`);
    // Rediriger vers le formulaire de commande approprié en utilisant navigate
    if (type === 'pieces-coupees') {
      navigate('/order/pieces-coupees');
    } else if (type === 'a-a-z') {
      navigate('/order/a-to-z');
    }
    setIsOrderModalOpen(false);
  };

  // Services offerts
  const services = [
    {
      id: 1,
      title: 'Confection sur mesure',
      description: 'Nous créons des vêtements personnalisés selon vos spécifications exactes, en utilisant des tissus de haute qualité pour garantir confort et durabilité.',
      icon: faTshirt
    },
    {
      id: 2,
      title: 'Création de modèles',
      description: 'Notre équipe de designers expérimentés travaille avec vous pour créer des modèles uniques qui correspondent parfaitement à votre vision et à vos besoins.',
      icon: faPencilRuler
    },
    {
      id: 3,
      title: 'Impression photo de qualité',
      description: 'Nous offrons des services d\'impression photo de haute qualité pour vos projets personnels ou professionnels, avec une attention particulière aux détails et aux couleurs.',
      icon: faClipboardCheck
    }
  ];

  // Étapes de travail
  const workSteps = [
    {
      id: 1,
      title: 'Conception/Design',
      description: 'Choix du modèle et sélection des tissus en collaboration avec nos designers pour créer le vêtement parfait selon vos spécifications.',
      icon: faPencilRuler
    },
    {
      id: 2,
      title: 'Patronnage',
      description: 'Création de patrons précis basés sur les mesures et le design choisi, assurant un ajustement parfait du vêtement final.',
      icon: faRulerCombined
    },
    {
      id: 3,
      title: 'Coupe Tissu',
      description: 'Découpe minutieuse des tissus selon les patrons établis, avec une attention particulière à l\'optimisation des matériaux.',
      icon: faCut
    },
    {
      id: 4,
      title: 'Confection',
      description: 'Assemblage des pièces de tissu par nos artisans qualifiés, utilisant des techniques de couture avancées pour garantir durabilité et finition impeccable.',
      icon: faTshirt
    },
    {
      id: 5,
      title: 'Finition',
      description: 'Repassage, nettoyage et vérification finale pour s\'assurer que chaque détail répond à nos standards de qualité élevés.',
      icon: faSprayCan
    },
    {
      id: 6,
      title: 'Contrôle Qualité',
      description: 'Vérification rigoureuse et emballage soigné de chaque produit avant livraison pour garantir votre satisfaction totale.',
      icon: faClipboardCheck
    }
  ];

  return (
    <div className="services-page">
      {showLoginAlert && (
        <Alert
          type="info"
          message="Vous devez être connecté pour passer une commande. Redirection vers la page de connexion..."
          autoClose={true}
          autoCloseTime={2000}
        />
      )}
      {/* Hero Section */}
      <div className="services-hero">
        <div className="container">
          <AdvancedAnimatedSection
            animationType="slideFromTop"
            duration={1.0}
            delay={0.1}
          >
            <h1 className="services-hero-title">Nos Services</h1>
          </AdvancedAnimatedSection>
          
          <AdvancedAnimatedSection
            animationType="fadeIn"
            duration={1.0}
            delay={0.3}
          >
            <p className="services-hero-subtitle">
              Des solutions textiles de qualité supérieure adaptées à vos besoins
            </p>
          </AdvancedAnimatedSection>
        </div>
      </div>

      {/* Services Section */}
      <section className="services-offered-section">
        <div className="container">
          <AdvancedAnimatedSection
            animationType="slideFromLeft"
            duration={1.0}
            delay={0.2}
          >
            <h2 className="section-title">Services Offerts</h2>
            <p className="section-subtitle">Découvrez notre gamme complète de services textiles professionnels</p>
          </AdvancedAnimatedSection>

          <div className="services-grid">
            {services.map((service, index) => (
              <AdvancedAnimatedSection
                key={service.id}
                animationType="fadeInScale"
                duration={1.0}
                delay={0.1 * (index + 1)}
                className="service-card"
              >
                <div className="service-icon">
                  <FontAwesomeIcon icon={service.icon} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </AdvancedAnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" delay={0.3} />

      {/* Work Steps Section */}
      <section className="work-steps-section">
        <div className="container">
          <AdvancedAnimatedSection
            animationType="slideFromRight"
            duration={1.0}
            delay={0.2}
          >
            <h2 className="section-title">Notre Processus de Travail</h2>
            <p className="section-subtitle">De la conception à la livraison, découvrez comment nous créons des produits textiles de qualité</p>
          </AdvancedAnimatedSection>

          <div className="work-steps-container">
            {workSteps.map((step, index) => (
              <AdvancedAnimatedSection
                key={step.id}
                animationType="slideFromLeft"
                duration={0.8}
                delay={0.1 * (index + 1)}
                className="work-step"
              >
                <div className="step-number">{step.id}</div>
                <div className="step-content">
                  <div className="step-icon">
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </AdvancedAnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" delay={0.3} />

      {/* CTA Section */}
      <section className="services-cta-section">
        <div className="container">
          <AdvancedAnimatedSection
            animationType="fadeIn"
            duration={1.0}
            delay={0.2}
            className="cta-content"
          >
            <h2 className="cta-title">Prêt à commencer votre projet?</h2>
            <p className="cta-description">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            <Button 
              variant="primary" 
              size="large" 
              className="cta-button"
              onClick={handleOrderButtonClick}
            >
              Passer une commande <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
            </Button>
          </AdvancedAnimatedSection>
        </div>
      </section>
      {/* Modal de sélection du type de commande */}
      <Modal 
        isOpen={isOrderModalOpen} 
        onClose={handleCloseModal}
        title="Choisir le type de commande"
        size="large"
      >
        <OrderTypeSelector 
          onSelectType={handleSelectOrderType} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default ServicesPage;