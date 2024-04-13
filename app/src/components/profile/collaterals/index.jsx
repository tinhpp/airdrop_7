import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { getOrders } from '@src/api/order.api';
import { getTokenBoundAccountByHash } from '@src/api/token-bound-account.api';
import Card from '@src/components/common/card';
import ListCollateralForm from '@src/components/common/list-collateral-form';
import TokenBoundAccountCard from '@src/components/common/token-bound-account-card';
import { COLLATERAL_FORM_TYPE, OrderStatus } from '@src/constants';
import styles from './styles.module.scss';

export default function Collateral() {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const [selectedTokenBoundAccount, setSelectedTokenBoundAccount] = useState();

  const fetchOrderList = async () => {
    try {
      const { data } = await getOrders({ creator: account.address, status: OrderStatus.OPENING });
      setOrderList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleOnClose = (isRefetch = false) => {
    setSelectedOrder();
    setSelectedTokenBoundAccount();
    if (isRefetch) fetchOrderList();
  };

  const handleTokenBoundAccount = async (order) => {
    try {
      const { data } = await getTokenBoundAccountByHash(order.metadata.hash);
      setSelectedTokenBoundAccount({ metadata: order.metadata, tokenBoundAccount: data });
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, [account.address]);

  return (
    <div className={styles.container}>
      {selectedOrder && (
        <ListCollateralForm item={selectedOrder} onClose={setSelectedOrder} type={COLLATERAL_FORM_TYPE.VIEW} />
      )}

      {selectedTokenBoundAccount && <TokenBoundAccountCard item={selectedTokenBoundAccount} onClose={handleOnClose} />}
      <div className={styles.heading}>Your collaterals</div>
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
              action={{ text: 'List collateral', handle: () => setSelectedOrder(order) }}
              handleTokenBoundAccount={() => handleTokenBoundAccount(order)}
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
