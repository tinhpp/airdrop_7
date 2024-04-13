/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { calculateRepayment, sliceAddress, getOfferStatusText } from '@src/utils';
import styles from './styles.module.scss';

export default function Table({ title, data, action }) {
  const account = useSelector((state) => state.account);

  return (
    <div className={styles.table}>
      <div className={styles.heading}>{title}</div>
      <div className={styles['table-list']}>
        <div className={styles['table-list-item']}>Order</div>
        <div className={styles['table-list-item']}>Lender</div>
        <div className={styles['table-list-item']}>Borrower</div>
        <div className={styles['table-list-item']}>Loan value</div>
        <div className={styles['table-list-item']}>Repayment</div>
        <div className={styles['table-list-item']}>Duration</div>
        <div className={styles['table-list-item']}>APR</div>
        <div className={styles['table-list-item']}>Status</div>
        <div className={styles['table-list-item']}>Created At</div>
        <div className={styles['table-list-item']}>Expiration</div>
        <div className={styles['table-list-item']}>Action</div>
      </div>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div className={styles['table-list']} key={index}>
            <div className={styles['table-list-item']}>{sliceAddress(item.order)}</div>
            <div className={styles['table-list-item']}>{sliceAddress(item.creator)}</div>
            <div className={styles['table-list-item']}>{sliceAddress(item.borrower)}</div>
            <div className={styles['table-list-item']}>
              {item.offer} {account.currency}
            </div>
            <div className={styles['table-list-item']}>
              {calculateRepayment(item.offer, item.rate, item.duration)} {account.currency}
            </div>
            <div className={styles['table-list-item']}>{item.duration} days</div>
            <div className={styles['table-list-item']}>{item.rate} %</div>
            <div className={styles['table-list-item']}>
              {getOfferStatusText(item.status)}
            </div>

            <div className={styles['table-list-item']}>{new Date(item.createdAt).toLocaleDateString()}</div>
            <div className={styles['table-list-item']}>{item.expiration} days</div>
            <div className={styles['table-list-item']}>
              <button onClick={() => action.handle(item)}>{action.text}</button>
            </div>
          </div>
        ))
      ) : (
        <div className={styles['no-data']}>
          <span>No data</span>
        </div>
      )}
    </div>
  );
}
