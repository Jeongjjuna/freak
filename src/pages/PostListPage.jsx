import React, {useEffect, useState} from 'react';
import BlogLoader from "../utils/BlogLoader.js";

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
    <div>
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