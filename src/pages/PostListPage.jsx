import React, {useEffect, useState} from 'react';
import gif1 from "../assets/gif_1.gif";
import Banner from "../components/Banner.jsx";
import BlogSimple from "../components/BlogSimple.jsx";
import Options from "../components/Options.jsx";
import BlogLoader from "../utils/BlogLoader.js";
import styles from './PostListPage.module.css';

function PostListPage() {

  const [blogInfos, setBlogInfos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogInfos = await BlogLoader.loadBlogList();

      // 정렬 후 저장 -> 추후에 조건에 따라 수정해야할 수 있음.
      blogInfos.sort((a, b) => new Date(b.date) - new Date(a.date));

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
    <>
      <div className={styles.gifContainer}>
        <img src={gif1} alt="배너 커스텀 이미지" className={styles.gifImg}/>
      </div>
      <div className={styles.container}>
        <Banner/>
        <Options categories={categories} tags={tags}/>
        <BlogSimple blogInfos={blogInfos}/>
      </div>
    </>
  );
}

export default PostListPage;