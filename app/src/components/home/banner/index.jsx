import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';

export default function Banner() {
  const currency = useSelector(state => state.account.currency);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          Use your NFTs to <br />
          get a crypto loan
        </h1>
        <div className={styles.description}>
          Use your NFT as collateral to borrow {currency} <br />
          from lenders. Repay your loan, and you get your <br />
          NFT back.
        </div>
        <div className={styles['button-wrap']}>
          <Link to="/borrow/assets" className={styles.active}>
            Get a loan now
          </Link>
          <Link to="/lend/assets" className={styles.deactive}>
            I want to lend
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        <img
          src="https://images.ctfassets.net/21yktilggb3f/sqhtFyr1UQbHZmf1f4b8H/9e3f2fa2c4f4007524b5aa682d5aa8fd/nftfi-hero-image.png?w=800&h=575&q=100&fm=webp"
          alt="NFT Lending"
        />
      </div>
    </div>
  );
}
