import {useEffect, useState} from "react";
import styles from './App.module.css';
import BlogLoader from "./utils/BlogLoader.js";

function App() {

  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    const blogs = BlogLoader.loadBlogList();
    setBlogList(blogs);
  }, []);

  return (
    <>
      <div className={styles.header}></div>
      <div className={styles.body}>freak blog</div>
      <div className={styles.footer}></div>
    </>
  )
}

export default App
