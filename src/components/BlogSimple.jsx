import {Link} from "react-router-dom";
import styles from './BlogSimple.module.css';

function BlogSimple(props) {
  const { blogInfos } = props;

  return (
    <ul className={styles.blogSimple}>
      {blogInfos.map((blogInfo, index) => (
        <Link to={`/posts/${blogInfo.title}`} key={index}>
          <li className={styles.content}>
            <img
              src={`thumbnail/${blogInfo.thumbnail}`}
              width={100}
              height={100}
              alt="thumbnail"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'thumbnail/기본썸네일.png';
              }}
            />
            <p>{blogInfo.title}</p>
            <p>{blogInfo.date}</p>
            <p>{blogInfo.category}</p>
            <ul>
              {blogInfo.tags.map((tag, index) => (
                <li key={index}>
                  <p>{tag}</p>
                </li>
              ))}
            </ul>
          </li>
        </Link>
      ))}
    </ul>
  );
}

export default BlogSimple;