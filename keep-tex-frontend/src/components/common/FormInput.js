import React from 'react';
import PropTypes from 'prop-types';
import './FormInput.css';

const FormInput = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const inputClasses = [
    'form-input',
    error ? 'input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
          disabled={disabled}
          {...rest}
        />
      );
    }

    return (
      <input
        type={type}
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        required={required}
        disabled={disabled}
        {...rest}
      />
    );
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FormInput;