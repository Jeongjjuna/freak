import React from 'react';
import styles from './Category.module.css';


function Category(props) {
  const { category } = props

  return (
    <div className={styles.category}>{category}</div>
  );
}

export default Category;