/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number (accepts various formats)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Validation moins stricte pour les numéros de téléphone tunisiens et internationaux
  // Accepte les formats comme +216 12 345 678, 12345678, etc.
  if (!phone) return true; // Le téléphone est optionnel
  const phoneRegex = /^[+]?[0-9\s()-]{8,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a password (min 8 chars, at least 1 letter and 1 number)
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is valid
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates a form field based on its type
 * @param {string} type - The type of field to validate
 * @param {string} value - The value to validate
 * @returns {boolean} - Whether the value is valid for the given type
 */
export const validateField = (type, value) => {
  switch (type) {
    case 'email':
      return isValidEmail(value);
    case 'phone':
      return isValidPhone(value);
    case 'password':
      return isValidPassword(value);
    case 'text':
      return value.trim().length > 0;
    default:
      return true;
  }
};

/**
 * Validates a contact form
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateContactForm = (formData) => {
  console.log('Validation du formulaire:', formData);
  const errors = {};
  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Le nom est requis';
  }
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Un email valide est requis';
  }
  
  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = 'Un numéro de téléphone valide est requis';
  }
  
  if (!formData.subject || formData.subject.trim() === '') {
    errors.subject = 'Le sujet est requis';
  }
  
  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'Le message est requis';
  }
  
  const isValid = Object.keys(errors).length === 0;
  console.log('Formulaire valide:', isValid, 'Erreurs:', errors);
  
  return {
    isValid: isValid,
    errors,
  };
};