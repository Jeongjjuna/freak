import styles from './App.module.css';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

function App({children}) {
  return (
    <>
      <Header/>
      <div className={styles.container}>{children}</div>
      <Footer/>
    </>
  )
}

export default App
