import styles from './App.module.css';
import Content from "./components/Content.jsx";

function App() {
  return (
    <>
      <div className={styles.header}></div>
      <Content className={styles.body}/>
      <div className={styles.footer}></div>
    </>
  )
}

export default App
