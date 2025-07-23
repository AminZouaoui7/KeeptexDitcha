import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({
  title,
  subtitle,
  image,
  content,
  linkTo,
  linkText = 'Learn More',
  className = '',
  onClick,
  ...rest
}) => {
  const cardClasses = ['custom-card', className].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...rest}>
      {image && (
        <div className="card-image-container">
          <img src={image} alt={title} className="card-image" />
        </div>
      )}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <h4 className="card-subtitle">{subtitle}</h4>}
        {content && <div className="card-text">{content}</div>}
        {linkTo && (
          <Link to={linkTo} className="card-link">
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  content: PropTypes.node,
  linkTo: PropTypes.string,
  linkText: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;