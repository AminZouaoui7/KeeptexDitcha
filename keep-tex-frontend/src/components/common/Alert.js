import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import './Alert.css';

const Alert = ({
  type = 'info',
  message,
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const alertClasses = [
    'alert',
    `alert-${type}`,
    className,
  ].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      case 'warning':
        return faExclamationCircle;
      case 'info':
      default:
        return faInfoCircle;
    }
  };

  return (
    <div className={alertClasses} role="alert">
      <div className="alert-icon">
        <FontAwesomeIcon icon={getIcon()} />
      </div>
      <div className="alert-content">{message}</div>
      {onClose && (
        <button className="alert-close" onClick={handleClose} aria-label="Close">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  autoCloseTime: PropTypes.number,
  className: PropTypes.string,
};

export default Alert;