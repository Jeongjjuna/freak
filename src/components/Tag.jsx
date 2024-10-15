import React from 'react';
import styles from './Tag.module.css';


function Tag(props) {
  const { tag } = props;

  return (
    <div className={styles.tag}>{tag}</div>
  );
}

export default Tag;