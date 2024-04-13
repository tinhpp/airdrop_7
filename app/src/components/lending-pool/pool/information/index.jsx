import { InlineIcon } from '@iconify/react';
import { getRandomNumber } from '@src/utils';
import styles from '../styles.module.scss';

export default function Information({ title, value, icon, isInterest = false }) {
  const lendingInterest = 50 + getRandomNumber(0, 20);
  const validatorInterest = 100 - lendingInterest;

  return (
    <div className={`${styles.item} ${styles.information}`}>
      <div className={styles.content}>
        <div className={styles.title}>
          <span>{title}</span>
          {isInterest && (
            <div className={styles['tooltip']}>
              <InlineIcon icon="mdi:information-outline" fontSize={20} className={styles['tooltip-icon']} />
              <div className={styles['tool-tip-content']}>
                <div>{lendingInterest}% from Lending</div>
                <div>{validatorInterest}% from Avengers Node</div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.value}>{value}</div>
      </div>
      <img src={icon} />
    </div>
  );
}
