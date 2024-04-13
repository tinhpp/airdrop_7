/* eslint-disable react/prop-types */
import { useImageLoaded } from '@src/hooks/useImageLoaded';
import styles from './styles.module.scss';
import Skeleton from 'react-loading-skeleton';

export default function Card({ item, action: { text, handle }, handleTokenBoundAccount }) {
  const [ref, loaded, onLoad] = useImageLoaded();

  return (
    <div className={styles.card}>
      <div className={styles['image-wrap']}>
        <img ref={ref} src={item.image} style={{ display: loaded ? 'block' : 'none' }} onLoad={onLoad} />
        {!loaded && <Skeleton className={styles.skeleton} />}
        <div className={styles['make-collateral-wrap']}>
          <button onClick={() => handle(item)}>{text}</button>
        </div>
      </div>
      <div className={styles.collection}>{item.collection}</div>
      <div className={styles.name}>{item.name}</div>
      <div className={styles.extension}>
        <span>{item.isTokenBoundAccount || item.hash ? 'Token bound account' : 'ERC-721'}</span>
        {(item.isTokenBoundAccount || item.hash) && <button onClick={handleTokenBoundAccount}>View assets</button>}
      </div>
    </div>
  );
}
