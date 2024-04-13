import { useState, useEffect } from 'react';
import { getOrderByHash } from '@src/api/order.api';
import { useParams, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import HeaderBanner from '@src/components/layouts/header-banner';
import { OrderStatus } from '@src/constants';
import MakeOffer from './make-offer';

export default function Assets() {
  const { hash } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState();

  useEffect(() => {
    if (hash) {
      getOrderByHash(hash)
        .then(({ data }) => {
          if (!data || data.lender === 'pool' ||data.status !== OrderStatus.OPENING ) navigate('/lend/assets');
          setOrder(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [hash]);

  if (isLoading)
    return (
      <div className="react-loading-item" style={{ marginTop: '200px' }}>
        <ReactLoading type="bars" color="#fff" height={100} width={120} />
      </div>
    );

  return (
    <>
      <HeaderBanner title={order.metadata.collection} description={order.metadata.name} right={false} />
      <MakeOffer item={order} />
    </>
  );
}
