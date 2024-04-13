/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { calculateRepayment, sliceAddress, getRequestStatusText } from '@src/utils';
import styles from './styles.module.scss';

export default function Table({ title, data, action }) {
  const account = useSelector((state) => state.account);

  console.log('Data: ', data);

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
            <div className={styles['table-list-item']}>{sliceAddress(item.order.hash)}</div>
            <div className={styles['table-list-item']}>{sliceAddress(item.creator)}</div>
            <div className={styles['table-list-item']}>{sliceAddress(item.lender || item.borrower)}</div>
            <div className={styles['table-list-item']}>
              {item.order.offer} {account.currency}
            </div>
            <div className={styles['table-list-item']}>
              {calculateRepayment(item.order.offer, item.order.rate, item.order.duration)} {account.currency}
            </div>
            <div className={styles['table-list-item']}>{item.order.duration} days</div>
            <div className={styles['table-list-item']}>{item.order.rate} %</div>
            <div className={styles['table-list-item']}>{getRequestStatusText(item.status)}</div>

            <div className={styles['table-list-item']}>{new Date(item.order.createdAt).toLocaleDateString()}</div>
            <div className={styles['table-list-item']}>{item.expiration} day(s)</div>
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
