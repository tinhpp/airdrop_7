/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { getOffers } from '@src/api/offer.api';
import { OfferStatus } from '@src/constants/enum';
import OfferView from '@src/components/common/offer-view';
import Table from '@src/components/common/offer-table';
import styles from './styles.module.scss';

export default function Offers() {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [offerList, setOfferList] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState();

  const handleCancelOffer = () => {
    
  }

  const fetchOffers = async () => {
    try {
      const { data } = await getOffers({ creator: account.address, status: OfferStatus.OPENING });
      setOfferList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [account.address]);

  return (
    <div className={styles.container}>
      {selectedOffer && <OfferView item={selectedOffer} onClose={setSelectedOffer} action={{  text: 'Cancel', handle: handleCancelOffer }} />}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <Table title="Offers sent" data={offerList} action={{ text: 'View', handle: setSelectedOffer }} />
      )}
    </div>
  );
}
