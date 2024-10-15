import React from 'react';
import Category from "./Category.jsx";
import styles from './Options.module.css';
import Tag from "./Tag.jsx";

function Options(props) {
  const { categories, tags } = props;

  return (
    <div className={styles.options}>
      <div className={styles.content}>
        <div className={styles.title}>카테고리</div>
        <ul>
          {categories.map((category, index) => (
            <Category key={index} category={category}/>
          ))}
        </ul>
        <div className={styles.title}>태그</div>
        <ul>
          {tags.map((tag, index) => (
            <Tag key={index} tag={tag}/>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Options;