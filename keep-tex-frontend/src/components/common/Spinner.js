import React from 'react';
import PropTypes from 'prop-types';
import './Spinner.css';

const Spinner = ({ size = 'medium', color = 'primary', fullPage = false, text = 'Loading...' }) => {
  const spinnerClasses = [
    'spinner',
    `spinner-${size}`,
    `spinner-${color}`,
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'spinner-container',
    fullPage ? 'spinner-fullpage' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white']),
  fullPage: PropTypes.bool,
  text: PropTypes.string,
};

export default Spinner;