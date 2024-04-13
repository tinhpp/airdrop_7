import Swap from './swap';
import History from './history';
import styles from './styles.module.scss';

export default function Exchange() {

  return (
    <div className={styles.container}>
      <Swap />
      <History />
    </div>
  );
}
