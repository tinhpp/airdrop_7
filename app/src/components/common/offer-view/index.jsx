/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import ReactLoading from 'react-loading';
import { Icon } from '@iconify/react';
import { calculateRepayment, sliceAddress } from '@src/utils';
import { getOrderByHash } from '@src/api/order.api';
import styles from './styles.module.scss';
import RequestForm from '../request-form';
import { useCallback } from 'react';
import { OrderStatus } from '../../../constants/enum';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function OfferView({ item, onClose, action }) {
  const ref = useRef(null);
  const rate = useSelector((state) => state.rate.rate);
  const currency = useSelector((state) => state.account.currency);

  const [data, setData] = useState(item);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenRequest, setIsOpenRequest] = useState(false);

  // useOnClickOutside(ref, () => onClose());

  const fetchOrder = async () => {
    try {
      const { data: order } = await getOrderByHash(item.order);
      setData({ ...data, order });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleOpenRequestForm = useCallback(() => {
    setIsOpenRequest(!isOpenRequest);
  }, [isOpenRequest]);

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className={styles['form-container']}>
      <div className={styles.form} ref={ref}>
        <Icon icon="material-symbols:close" className={styles['close-btn']} onClick={() => onClose()} />
        {isLoading ? (
          <div className="react-loading-item mb-60 mt-60">
            <ReactLoading type="bars" color="#fff" height={100} width={120} />
          </div>
        ) : (
          <div className={styles.row}>
            <div className={styles.section}>
              <img src={data.order.metadata.image} alt="NFT Image" />
            </div>
            <div className={styles.section}>
              <div className={styles.info}>
                <div className={styles.label}>Name:</div>
                <div className={styles.value}>
                  <span>{data.order.metadata.name}</span>
                  {!data.lender && (
                    <Link to={`/assets/${data.order.hash}`} target="_blank">
                      <Icon icon="uil:edit" />
                    </Link>
                  )}
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.label}>Lender: </div>
                <div className={styles.value}>
                  <span>{data.lender ? 'Lending Pool' : sliceAddress(data.creator)}</span>
                  {!data.lender && (
                    <Link to={`${data.lender ? 'lending-pool' : CVC_SCAN}/address/${data.creator}`} target="_blank">
                      <Icon icon="uil:edit" />
                    </Link>
                  )}
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.label}>Borrower: </div>
                <div className={styles.value}>
                  <span>{sliceAddress(data.order.creator)}</span>
                  <Link to={`${CVC_SCAN}/address/${data.order.creator}`} target="_blank">
                    <Icon icon="uil:edit" />
                  </Link>
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.label}>Amount: </div>
                <div className={styles.value}>
                  {data.offer} {currency}
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.label}>Duration: </div>
                <div className={styles.value}>{data.duration} days</div>
              </div>
              <div className={styles.info}>
                <div className={styles.label}>Repayment: </div>
                <div className={styles.value}>
                  {calculateRepayment(data.offer, data.rate, data.duration)} {currency}
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.label}>APR: </div>
                <div className={styles.value}>{data.rate}%</div>
              </div>
              <div className={styles.info}>
                <div className={styles.label}>Float price: </div>
                <div className={styles.value}>
                  {data.floorPrice} {currency}
                </div>
              </div>
              {action && (
                <div className={styles.info}>
                  {data.status === OrderStatus.FILLED && (
                    <button onClick={() => handleOpenRequestForm()}>Renegotiate</button>
                  )}
                  <button onClick={() => action.handle(data)}>{action.text}</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isOpenRequest && <RequestForm item={data} onClose={handleOpenRequestForm} />}
    </div>
  );
}
