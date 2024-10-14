import React, {useEffect, useState} from 'react';
import Banner from "../components/Banner.jsx";
import BlogLoader from "../utils/BlogLoader.js";
import styles from './PostListPage.module.css';

function PostListPage(props) {

  const [blogInfos, setBlogInfos] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogInfos = await BlogLoader.loadBlogList();
      setBlogInfos(blogInfos);
    };
    void fetchBlogs();
  }, []);

  return (
    <div className={styles.container}>
      <Banner/>
      <ul>
        {blogInfos.map((blogInfo, index) => (
          <li key={index}>
            <p>{blogInfo.date}</p>
            <p>{blogInfo.title}</p>
            <p>{blogInfo.category}</p>
            <ul>
              {blogInfo.tags.map((tag, index) => (
                <li key={index}>
                  <p>{tag}</p>
                </li>
              ))}
            </ul>
            <p>{blogInfo.thumbnail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostListPage;