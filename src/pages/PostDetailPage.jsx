import {useEffect, useRef, useState} from "react";
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
  const [currentHeading, setCurrentHeading] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const headingsRef = useRef([]);


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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /**
   * h1, h2 이름으로부터 고유한 id를 생성한다.
   * create element id
   */
  function getId(title) {
    return title.toLowerCase()
      .replace(/\s+/g, '-') // 모든 공백을 하이픈으로 변환
      .replace(/-+$/, ''); // 문자열 끝의 하이픈 제거
  }


  const handleScroll = () => {
    const scrollY = window.scrollY;
    headingsRef.current.forEach((heading) => {
      if (heading) {
        const { offsetTop, clientHeight } = heading;
        if (scrollY >= offsetTop - clientHeight / 2 && scrollY < offsetTop + clientHeight / 2) {
          setCurrentHeading(heading.id);
        }
      }
    });
  };

  const handleClick = (id) => {
    const headingElement = document.getElementById(id);
    if (headingElement) {
      headingElement.scrollIntoView({ behavior: 'smooth' });
      setCurrentHeading(id);
      setActiveButton(id); // 클릭한 버튼 활성화
    }
  };

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
                e.target.src = '../thumbnail/loading.gif';
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
        <nav className={styles.scrollNav}>
          <ul>
            {Array.from(markdown.matchAll(/(#{1,2})\s+(.*)/g)).map((match, index) => {
              // const level = match[1].length;
              const title = match[2];
              const id = getId(title);
              return (
                <li key={index}>
                  <button
                    className={styles.scrollNavButton}
                    onClick={() => handleClick(id)}
                    style={{
                      backgroundColor: activeButton === id ? '#646265' : '#ffffff',
                      color: activeButton === id ? '#ffffff' : '#000000',
                    }}
                  >
                    {title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
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
              h1(props) {
                const title = props.children;
                const id = getId(title);
                return (
                  <h1 id={id} ref={(el) => (headingsRef.current.push(el))} {...props}>
                    {title}
                  </h1>
                );
              },
              h2(props) {
                const title = props.children;
                const id = getId(title);
                return (
                  <h2 id={id} ref={(el) => (headingsRef.current.push(el))} {...props}>
                    {title}
                  </h2>
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