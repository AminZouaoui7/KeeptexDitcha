import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  closeOnOutsideClick = true,
  showCloseButton = true,
  size = 'medium',
}) => {
  const modalRef = useRef(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalClasses = [
    'modal-container',
    className,
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'modal-content',
    `modal-${size}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={modalClasses} onClick={handleOutsideClick}>
      <div className={contentClasses} ref={modalRef}>
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          {showCloseButton && (
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  closeOnOutsideClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
};

export default Modal;