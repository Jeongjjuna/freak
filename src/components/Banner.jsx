import React from 'react';
import styles from './Banner.module.css';

function Banner() {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>배너</div>
    </div>
  );
}

export default Banner;