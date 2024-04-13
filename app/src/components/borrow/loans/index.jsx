/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { getOffers } from '@src/api/offer.api';
import { OfferStatus, FormType } from '@src/constants/enum';
import OfferView from '@src/components/common/offer-view';
import Table from '@src/components/common/offer-table';
import styles from './styles.module.scss';
import { payBackLoan, checkAllowance, approveERC20, parseMetamaskError, calculateRepayment } from '@src/utils';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

export default function Loans() {
  const account = useSelector((state) => state.account);

  const [commitLoading, setCommitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offerList, setOfferList] = useState({
    current: [],
    previous: [],
  });
  const [selectedOffer, setSelectedOffer] = useState();
  const [offerViewType, setOfferViewType] = useState(FormType.VIEW);

  const handleRepayOffer = async (offer) => {
    try {
      setCommitLoading(true);
      const repayment = calculateRepayment(offer.offer, offer.rate, offer.duration);
      if (!(await checkAllowance(account.address, ethers.utils.parseUnits(`${repayment}`, 18)))) {
        const tx = await approveERC20(ethers.utils.parseUnits(`${repayment}`, 18));
        await tx.wait();
      }
      const tx = await payBackLoan(offer.hash);
      await tx.wait();
      setCommitLoading(false);
      toast.success('Pay back loan successfully');
      setSelectedOffer();
    } catch (error) {
      const txError = parseMetamaskError(error);
      setCommitLoading(false);
      toast.error(txError.context);
    }
  };

  const handleViewOffer = (offer, type) => {
    setSelectedOffer(offer);
    setOfferViewType(type);
  };

  const fetchOffers = async () => {
    try {
      const [offerList1, offerList2] = await Promise.all([
        getOffers({ borrower: account.address, status: OfferStatus.FILLED }),
        getOffers({ borrower: account.address, status: `${OfferStatus.REPAID},${OfferStatus.LIQUIDATED}` }),
      ]);
      setOfferList({
        current: offerList1.data,
        previous: offerList2.data,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
      toast.error('An error has been occurred!');
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [account.address]);

  return (
    <div className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      {commitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      {selectedOffer &&
        (offerViewType === FormType.VIEW ? (
          <OfferView item={selectedOffer} onClose={setSelectedOffer} />
        ) : (
          <OfferView
            item={selectedOffer}
            onClose={setSelectedOffer}
            action={{ text: 'Repay', handle: handleRepayOffer }}
          />
        ))}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <>
          <Table
            title="Current Loans as Borrower"
            data={offerList.current}
            action={{ text: 'View', handle: (item) => handleViewOffer(item, FormType.EDIT) }}
          />

          <Table
            title="Previous Loans as Borrower"
            data={offerList.previous}
            action={{ text: 'View', handle: (item) => handleViewOffer(item, FormType.VIEW) }}
          />
        </>
      )}
    </div>
  );
}
