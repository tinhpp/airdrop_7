import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import Menu from './menu';
import { Layout } from 'antd';

const { Footer: AFooter } = Layout;

export default function Footer() {
  return (
    <AFooter className={styles.footer}>
      <div className={styles.introduction}>
        <Link to="/" className={styles.logo}>
          AvengersFI
        </Link>
        <div className={styles.description}>
          AvengersFI is a peer-to-peer platform that lets NFT <br />
          holders and liquidity providers connect via <br />
          permissionless smart contract infrastructure.
        </div>
      </div>
      <Menu />
    </AFooter>
  );
}
