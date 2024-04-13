/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { getOffersByOrder } from '@src/api/offer.api';
import { calculateRepayment, sliceAddress } from '@src/utils';
import { getTokenBoundAccountByHash } from '@src/api/token-bound-account.api';
import Table from './table';
import Form from './form';
import TokenBoundAccountCard from '@src/components/common/token-bound-account-card';
import styles from './styles.module.scss';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function MakeOffer({ item }) {
  const { hash } = useParams();
  const currency = useSelector((state) => state.account.currency);

  const [offerList, setOfferList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTokenBoundAccount, setSelectedTokenBoundAccount] = useState();

  const fetchOffers = async () => {
    try {
      const { data } = await getOffersByOrder(hash, { status: 0 });
      setOfferList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleTokenBoundAccount = async () => {
    try {
      const { data } = await getTokenBoundAccountByHash(item.metadata.hash);
      setSelectedTokenBoundAccount({ metadata: item.metadata, tokenBoundAccount: data });
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className={styles.container}>
      {selectedTokenBoundAccount && (
        <TokenBoundAccountCard item={selectedTokenBoundAccount} onClose={() => setSelectedTokenBoundAccount()} />
      )}
      <div className={styles['make-offer']}>
        <div className={`${styles.section} ${styles['section-image']}`}>
          <img src={item.metadata.image} alt={item.metadata.name} />
          {item.metadata.hash && (
            <div className={styles['token-bound-account']}>
              <span>Token bound account</span>
              <button onClick={handleTokenBoundAccount}>View assets</button>
            </div>
          )}
        </div>
        <div className={styles.section}>
          <div className={styles['heading']}>Proposed offer from owner</div>
          <div className={styles.info}>
            <div className={styles.label}>Name: </div>
            <div className={styles.value}>{item.metadata.name}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Collection: </div>
            <div className={styles.value}>{item.metadata.collection}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Token ID: </div>
            <div className={styles.value}>{item.nftTokenId}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Address: </div>
            <div className={styles.value}>
              <span>{sliceAddress(item.nftAddress)}</span>
              <Link to={`${CVC_SCAN}/address/${item.nftAddress}`} target="_blank">
                <Icon icon="uil:edit" />
              </Link>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Borrower: </div>
            <div className={styles.value}>
              <span>{sliceAddress(item.creator)}</span>
              <Link to={`${CVC_SCAN}/address/${item.creator}`} target="_blank">
                <Icon icon="uil:edit" />
              </Link>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Amount: </div>
            <div className={styles.value}>
              {item.offer} {currency}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Duration: </div>
            <div className={styles.value}>{item.duration} days</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Repayment: </div>
            <div className={styles.value}>
              {calculateRepayment(item.offer, item.rate, item.duration)} {currency}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>APR: </div>
            <div className={styles.value}>{item.rate}%</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Float price: </div>
            <div className={styles.value}>
              {item.floorPrice} {currency}
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <Form order={item} fetchOffers={fetchOffers} />
        </div>
      </div>
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <Table title="Offers received" data={offerList} creator={item.creator} />
      )}
    </div>
  );
}
