import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, FormInput, Alert, AdvancedAnimatedSection } from '../common';
import contactService from '../../services/contactService';
import { validateContactForm } from '../../utils/validation';
import './Contact.css';

const Contact = () => {

  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulaire soumis', formData);
    
    // Validate form
    const { errors: validationErrors, isValid } = validateContactForm(formData);
    console.log('Erreurs de validation:', validationErrors, 'Formulaire valide:', isValid);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      console.log('Envoi du formulaire au serveur...');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      console.log('URL API complète:', apiUrl + '/contact');
      
      try {
        // Utiliser le service contactService pour envoyer le formulaire
        console.log('Tentative d\'envoi avec contactService');
        
        const response = await contactService.submitContactForm(formData);
        
        console.log('Réponse du serveur:', response);
        console.log('Formulaire envoyé avec succès');
        
        // Reset form and show success message
        setFormData(initialFormState);
        setAlert({
          show: true,
          type: 'success',
          message: 'Votre message a été envoyé avec succès à rh.bhbank.tn@gmail.com! Nous vous contacterons bientôt.'
        });
        
        // Hide alert after 8 seconds
        setTimeout(() => {
          setAlert({ show: false, type: '', message: '' });
        }, 8000);
      } catch (apiError) {
        console.error('Erreur API détaillée:', apiError);
        console.error('Message d\'erreur:', apiError.message);
        console.error('Réponse d\'erreur:', apiError.response ? apiError.response.data : 'Pas de réponse');
        console.error('Statut d\'erreur:', apiError.response ? apiError.response.status : 'Pas de statut');
        throw apiError; // Relancer l'erreur pour le bloc catch externe
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Échec de l\'envoi de votre message. Veuillez réessayer plus tard.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="section-header">
          <AdvancedAnimatedSection
            animationType="slideFromTop"
            duration={1.0}
            delay={0}
          >
            <h2 className="section-title">
              Contact Us
            </h2>
          </AdvancedAnimatedSection>
          
          <AdvancedAnimatedSection
            animationType="slideFromLeft"
            duration={1.0}
            delay={0.2}
          >
            <p className="section-subtitle">
              Explore our products and get in touch for custom orders.
            </p>
          </AdvancedAnimatedSection>
        </div>

        <div className="contact-grid">
          <AdvancedAnimatedSection
            animationType="slideFromLeft"
            duration={1.0}
            delay={0.4}
            staggerChildren={0.1}
            className="contact-info"
          >
            <h3 className="info-title">Get In Touch</h3>
            <p className="info-text">
              We're here to help with any questions about our products, services, or custom solutions.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className="contact-text">
                  <h4>Phone</h4>
                  <p>+216 71 123 456</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="contact-text">
                  <h4>Email</h4>
                  <p>keeptex77@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div className="contact-text">
                  <h4>Address</h4>
                  <p>Ezzahra, Ben Arous – Tunisie</p>
                </div>
              </div>
            </div>

            <div className="business-hours">
              <h4>Business Hours</h4>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 1:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </AdvancedAnimatedSection>

          <AdvancedAnimatedSection
            animationType="slideFromRight"
            duration={1.0}
            delay={0.6}
            className="contact-form-container"
          >
            {alert.show && (
              <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert({ show: false, type: '', message: '' })} 
                autoClose={true}
                autoCloseTime={8000}
                className={alert.type === 'success' ? 'alert-prominent' : ''}
              />
            )}
            
            <form className="contact-form" onSubmit={(e) => {
              console.log('Formulaire soumis via onSubmit');
              handleSubmit(e);
            }}>
              <div className="form-row">
                <div className="form-col">
                  <FormInput
                    label="Name"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    error={errors.name}
                    required
                  />
                </div>
                <div className="form-col">
                  <FormInput
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    error={errors.email}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <FormInput
                    label="Phone"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    error={errors.phone}
                  />
                </div>
                <div className="form-col">
                  <FormInput
                    label="Subject"
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    error={errors.subject}
                    required
                  />
                </div>
              </div>

              <FormInput
                label="Message"
                type="textarea"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                error={errors.message}
                required
              />

              <div className="form-submit">
                <Button 
                  type="button" 
                  variant="primary" 
                  disabled={loading}
                  onClick={(e) => {
                    console.log('Bouton cliqué');
                    handleSubmit(e);
                  }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </div>
            </form>
          </AdvancedAnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;