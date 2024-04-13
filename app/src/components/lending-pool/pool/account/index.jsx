/* eslint-disable react/prop-types */
import { XCR_PRICE } from '@src/constants';
import styles from './styles.module.scss';

export default function Account({ currency, balance, handleWithdraw, handleClaimReward }) {
  return (
    <div className={styles.account}>
      <div className={styles['balance-block']}>
        <div className={styles.title}>Your balance:</div>
        <div className={styles.balance}>
          {balance.balance} {currency}
        </div>
        <div className={styles.money}>${(balance.balance * XCR_PRICE).toFixed(2)}</div>
      </div>

      <div className={styles.block}>
        <div className={styles.content}>
          <div className={styles.label}>Withdraw staked</div>
          <div className={styles.value}>
            {balance.staked} {currency}
          </div>
          <button disabled={balance.staked == 0} onClick={() => handleWithdraw(balance.staked)}>
            Withdraw
          </button>
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.content}>
          <div className={styles.label}>Bonus rewards</div>
          <div className={styles.value}>
            {balance.bonus} {currency}
          </div>
          <button disabled={balance.bonus == 0} onClick={handleClaimReward}>
            Claim
          </button>
        </div>
      </div>
    </div>
  );
}
