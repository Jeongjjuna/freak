import {Link} from "react-router-dom";
import styles from './BlogSimple.module.css';

function BlogSimple(props) {
  const { blogInfos } = props;

  function getBlogName(blogInfo) {
    const rawFileName = blogInfo.getFileName();
    return encodeURIComponent(rawFileName);
  }

  return (
    <ul className={styles.blogSimple}>
      {blogInfos.map((blogInfo, index) => (
        <Link className={styles.content} to={`/posts/${getBlogName(blogInfo)}`} key={index}>
          <li className={styles.thumbnailSummaryContainer}>
            <div className={styles.thumbnailContainer}>
              <img
                className={styles.thumbnail}
                src={`thumbnail/${blogInfo.thumbnail}`}
                alt="thumbnail"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'thumbnail/기본썸네일.png';
                }}
              />
            </div>
            <div className={styles.summary}>
              <ul className={styles.tags}>
                {blogInfo.tags.map((tag, index) => (
                  <li key={index}>
                    <div className={styles.tag}>{tag}</div>
                  </li>
                ))}
              </ul>
              <div className={styles.options}>
                <div className={styles.category}>{blogInfo.category}</div>
                <div className={styles.date}>{blogInfo.date}</div>
              </div>
              <div className={styles.title}>{blogInfo.title}</div>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );
}

export default BlogSimple;