/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { getOffers } from '@src/api/offer.api';
import { calculateRepayment, acceptOffer, parseMetamaskError } from '@src/utils';
import { OfferStatus, ONE_DAY } from '@src/constants';
import OfferView from '@src/components/common/offer-view';
import Table from '@src/components/common/offer-table';
import styles from './styles.module.scss';

export default function Offers() {
  const account = useSelector((state) => state.account);

  const [isCommitLoading, setIsCommitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offerList, setOfferList] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState();

  const handleAcceptOffer = async (item) => {
    try {
      setIsCommitLoading(true);

      const repayment = calculateRepayment(item.offer, item.rate, item.duration);

      const offer = {
        principalAmount: ethers.utils.parseUnits(item.offer, 18),
        maximumRepaymentAmount: ethers.utils.parseUnits(`${repayment}`, 18),
        nftCollateralId: item.nftTokenId,
        nftCollateralContract: item.nftAddress,
        duration: item.duration * ONE_DAY,
        adminFeeInBasisPoints: item.adminFeeInBasisPoints,
        erc20Denomination: item.erc20Denomination,
      };

      const signature = item.signature;

      const tx = await acceptOffer(item.hash, offer, signature);
      await tx.wait();

      setIsCommitLoading(false);
      toast.success('Accept offer successfully');
    } catch (error) {
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setIsCommitLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const { data } = await getOffers({ borrower: account.address, status: OfferStatus.OPENING });
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
      {isCommitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />

      {selectedOffer && (
        <OfferView
          item={selectedOffer}
          onClose={setSelectedOffer}
          action={{ text: 'Accept', handle: handleAcceptOffer }}
        />
      )}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <Table title="Offers received" data={offerList} action={{ text: 'View', handle: setSelectedOffer }} />
      )}
    </div>
  );
}
