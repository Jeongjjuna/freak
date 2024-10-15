import {useEffect, useState} from "react";
import scrollup from '../assets/scrollup.png';
import styles from './App.module.css';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

function App({children}) {

  const [isVisible, setIsVisible] = useState(false);

  const heightForScrollUpButton = 10;

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > heightForScrollUpButton) {  // 300px 이상 스크롤 시 버튼 보이기
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Header/>
      <div className={styles.container}>{children}</div>
      <Footer/>

      {isVisible && (
        <div className={styles.scrollToTopButton} onClick={scrollToTop}>
          <img className={styles.scrollUpImg} src={scrollup} alt="ScrollImg"/>
        </div>
      )}
    </>
  )
}

export default App
