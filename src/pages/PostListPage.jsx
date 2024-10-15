import React, {useEffect, useState, useTransition} from 'react';
import Banner from "../components/Banner.jsx";
import Options from "../components/Options.jsx";
import BlogLoader from "../utils/BlogLoader.js";
import styles from './PostListPage.module.css';

function PostListPage(props) {

  const [blogInfos, setBlogInfos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogInfos = await BlogLoader.loadBlogList();
      setBlogInfos(blogInfos);
    };
    void fetchBlogs();

  }, []);

  useEffect(() => {
    if (blogInfos.length > 0) {
      const categories = [...new Set(blogInfos.map(blog => blog.category))];
      setCategories(categories);

      const tags = [...new Set(blogInfos.flatMap(blog => blog.tags))];
      setTags(tags);
    }
  }, [blogInfos]);

  return (
    <div className={styles.container}>
      <Banner/>
      <Options categories={categories} tags={tags}/>
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