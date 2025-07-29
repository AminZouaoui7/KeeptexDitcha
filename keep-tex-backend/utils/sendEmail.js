const nodemailer = require('nodemailer');

/**
 * Fonction pour envoyer un email
 * @param {Object} options - Options d'envoi d'email
 * @param {String} options.email - Email du destinataire
 * @param {String} options.subject - Sujet de l'email
 * @param {String} options.message - Contenu de l'email
 * @returns {Promise} - Promesse résolue après l'envoi de l'email
 */
const sendEmail = async (options) => {
  // Créer un transporteur SMTP réutilisable
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_EMAIL || 'votre-email@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'votre-mot-de-passe'
    }
  });

  // Définir les options de l'email
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'Keep-Tex'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL || 'noreply@keep-tex.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email envoyé: ${info.messageId}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    if (error.response) {
      console.error('SMTP response:', error.response);
    }
    if (error.code) {
      console.error('SMTP error code:', error.code);
    }
    throw error;
  }
};

module.exports = sendEmail;