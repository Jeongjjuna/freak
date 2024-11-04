import {useEffect, useState} from "react";
import styles from './Banner.module.css';

function Banner() {

  // 40 x 20 = 800 박스를 생성하기 위해 초기 상태 생성
  const [cells, setCells] = useState(Array(40* 16).fill(false));

  // 색상 변화 애니메이션 (타이머 기반)
  useEffect(() => {
    const interval = setInterval(() => {
      setCells(cells =>
        cells.map(() => Math.random() < 0.5) // 임의로 색칠 여부 결정
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.banner}>
      <div className={styles.gridContainer}>
        {cells.map((active, index) => (
          <div key={index} className={`${styles.cell} ${active ? styles.active : ''}`} />
        ))}
      </div>
    </div>
  );
}

export default Banner;