import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className, ...props }) => {
  const buttonClass = `${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${className || ''}`;

  return (
    <button type={type} onClick={onClick} className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;