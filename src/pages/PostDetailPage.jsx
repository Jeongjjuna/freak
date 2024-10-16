import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {useParams} from "react-router-dom";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import styles from './PostDetailPage.module.css';
import "highlight.js/styles/atom-one-dark.css";

function PostDetailPage() {

  const { postTitle } = useParams();
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("../blog/[20241014]_[블로그만들기 - 시작]_[블로그만들기시리즈]_[react kotlin]_[boj.png].md")
      .then((response) => response.text())
      .then((text) => {
        console.log(text);
        setMarkdown(text);
      });
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.infos}>React에서 markdown 랜더링하기 코틀린을 기가막히게 파헤치기</div>
        <div className={styles.content}>
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight, rehypeRaw, remarkGfm]}
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
              ul({ children, ...props }) {
                return (
                    <ul className={styles.ulContainer} {...props}>
                      {children}
                    </ul>
                );
              },
              li({ children, ...props }) {
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