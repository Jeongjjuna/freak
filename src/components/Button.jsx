import React from 'react';
import styles from './Button.module.css';

function Button({className = '', children, ...rest}) {
  return (
    <button className={`${styles.Button} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;