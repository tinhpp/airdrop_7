import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '@src/api/order.api';
import { OrderStatus } from '@src/constants/enum';
import Card from '@src/components/common/card';
import styles from './styles.module.scss';

export default function Assets() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);

  const handleMakeOffer = (order) => {
    const orderHash = order.hash;
    navigate(`/assets/${orderHash}`);
  };

  const fetchOrderList = async () => {
    try {
      const { data } = await getOrders({ lender: 'user', status: OrderStatus.OPENING });
      setOrderList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>List assets</div>
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : orderList.length > 0 ? (
        <div className={styles['list-nfts']}>
          {orderList.map((order, index) => (
            <Card
              key={index}
              item={order.metadata}
              action={{ text: 'Make offer', handle: () => handleMakeOffer(order) }}
            />
          ))}
        </div>
      ) : (
        <div className={styles['no-data']}>
          <span>No data</span>
        </div>
      )}
    </div>
  );
}
