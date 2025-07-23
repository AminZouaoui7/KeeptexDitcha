import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, FormInput, Alert } from '../common';
import { contactService } from '../../services';
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
    
    // Validate form
    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await contactService.submitContactForm(formData);
      
      // Reset form and show success message
      setFormData(initialFormState);
      setAlert({
        show: true,
        type: 'success',
        message: 'Your message has been sent successfully! We will get back to you soon.'
      });
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to send your message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">
            Have questions or need a quote? Reach out to us today.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
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
                  <p>info@keeptex.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div className="contact-text">
                  <h4>Address</h4>
                  <p>123 Textile Avenue, Tunis, Tunisia</p>
                </div>
              </div>
            </div>

            <div className="business-hours">
              <h4>Business Hours</h4>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 1:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="contact-form-container">
            {alert.show && (
              <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert({ show: false, type: '', message: '' })} 
              />
            )}
            
            <form className="contact-form" onSubmit={handleSubmit}>
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
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;