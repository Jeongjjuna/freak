import React from 'react';
import logo from '../assets/logo.png';
import {Link, NavLink} from "react-router-dom";
import styles from './Header.module.css';

function getLinkStyle({ isActive }) {
  return {
    color: isActive ? 'black' : 'grey', // 활성화 상태에서 색상 변경
  }
}

function Header(props) {
  const headerHeight = '85px';

  return (
    <div className={styles.header} style={{ height: headerHeight }}>
      <Link to="/posts"><img src={logo} width={headerHeight} height={headerHeight} alt="Freak Logo"/></Link>
      <ul className={styles.menu}>
        <li>
          <NavLink to="/posts" style={getLinkStyle}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/about" style={getLinkStyle}>About</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Header;