import React from 'react';
import styles from './Footer.module.css';

function Footer(props) {
  return (
    <div className={styles.footer}>
      <ul className={styles.links}>
        <li>Freak</li>
        <li>Contact wlgns2234@naver.com</li>
        <li>Copyright freak. All rights reserved</li>
      </ul>
      <ul className={styles.info}>
        <li>온통살</li>
        <li>공차</li>
        <li>블로그소개</li>
      </ul>
    </div>);
}

export default Footer;