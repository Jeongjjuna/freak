import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {useParams} from "react-router-dom";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import BlogLoader from "../utils/BlogLoader.js";
import styles from './PostDetailPage.module.css';
import "highlight.js/styles/atom-one-dark.css";

function PostDetailPage() {

  const {blogName} = useParams();
  const [markdown, setMarkdown] = useState("");
  const [blogInfo, setBlogInfo] = useState({
    title: '',
    date: '',
    category: '',
    tags: [],
    thumbnail: '기본썸네일.png',
  });

  useEffect(() => {
    const fileName = decodeURIComponent(blogName)
    fetch(`../blog/${fileName}.md`)
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(text);

        let blog = BlogLoader.extractFileInfo(fileName + '.md');
        setBlogInfo(blog);
      });
  }, [blogName]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.infos}>
          <div className={styles.thumbnailContainer}>
            <img
              className={styles.thumbnail}
              src={`../thumbnail/${blogInfo.thumbnail}`}
              alt="thumbnail"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '../thumbnail/기본썸네일.png';
              }}
            />
          </div>
          <div className={styles.infoTitle}>{blogInfo.title}</div>
          <div className={styles.infoSub}>
            <div className={styles.infoCategoryTag}>
              <div className={styles.infoCategory}>{blogInfo.category}</div>
              <div className={styles.infoTags}>
                {blogInfo.tags.map((tag, index) => (
                  <div className={styles.infoTag} key={index}>{tag}</div>
                ))}
              </div>
            </div>
            <div className={styles.infoDate}>{blogInfo.date}</div>
          </div>
        </div>
        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkHtml]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              pre({children, ...props}) { // Customizing <pre> tag
                return (
                  <div className={styles.preContainer}>
                    <div className={styles.preTop}>
                      <div className={`${styles.circle} ${styles.circleRed}`}></div>
                      <div className={`${styles.circle} ${styles.circleYellow}`}></div>
                      <div className={`${styles.circle} ${styles.circleGreen}`}></div>
                      <div className={styles.language}>kotlin</div>
                    </div>
                    <pre className={styles.preBottom} {...props}>
                      {children}
                    </pre>
                  </div>
                );
              },
              ul({children, ...props}) {
                return (
                  <ul className={styles.ulContainer} {...props}>
                    {children}
                  </ul>
                );
              },
              li({children, ...props}) {
                return (
                  <div className={styles.liContainer}> {/* 원하는 클래스명으로 div 감싸기 */}
                    <div className={styles.dot}></div>
                    <li {...props}>
                      {children}
                    </li>
                  </div>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
}

export default PostDetailPage;