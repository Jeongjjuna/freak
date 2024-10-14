import styles from './App.module.css';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

function App({children}) {
  return (
    <>
      <Header className={styles.header}/>
      <div className={styles.body}>{children}</div>
      <Footer className={styles.footer}/>
    </>
  )
}

export default App
