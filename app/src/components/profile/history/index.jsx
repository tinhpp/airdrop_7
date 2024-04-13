/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from 'ethers';
import OfferView from '@src/components/common/offer-view';
import { getOrders, getOrderByHash } from '@src/api/order.api';
import { getOffers } from '@src/api/offer.api';
import { OrderStatus, OfferStatus, FormType } from '@src/constants';
import { payBackLoan, checkAllowance, approveERC20, parseMetamaskError, calculateRepayment } from '@src/utils';
import Table from '@src/components/common/table';
import styles from './styles.module.scss';

export default function History() {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);
  const [offerViewType, setOfferViewType] = useState(FormType.VIEW);
  const [selectedLoan, setSelectedLoan] = useState();
  const [loans, setLoans] = useState({
    current: [],
    previous: [],
  });

  const handleRepayOffer = async (loan) => {
    try {
      setIsLoading(true);
      const repayment = calculateRepayment(loan.offer, loan.rate, loan.duration);
      if (!(await checkAllowance(account.address, ethers.utils.parseUnits(`${repayment}`, 18)))) {
        const tx = await approveERC20(ethers.utils.parseUnits(`${repayment}`, 18));
        await tx.wait();
      }
      const tx = await payBackLoan(loan.hash);
      await tx.wait();
      toast.success('Pay back loan successfully');
      setIsLoading(false);
      setSelectedLoan();
    } catch (error) {
      const txError = parseMetamaskError(error);
      setIsLoading(false);
      toast.error(txError.context);
    }
  };

  const handleViewOffer = (offer, type) => {
    setSelectedLoan(offer);
    setOfferViewType(type);
  };

  const fetchLoans = async () => {
    try {
      const [res1, res2, res3, res4, res5, res6] = await Promise.all([
        getOrders({ creator: account.address, lender: 'pool', status: OrderStatus.FILLED }),
        getOffers({ borrower: account.address, status: OfferStatus.FILLED }),
        getOrders({
          creator: account.address,
          lender: 'pool',
          status: `${OrderStatus.CANCELLED},${OrderStatus.REPAID},${OrderStatus.LIQUIDATE},${OrderStatus.REJECTED}`,
        }),
        getOffers({ borrower: account.address, status: `${OfferStatus.REPAID},${OfferStatus.LIQUIDATED}` }),
        getOffers({ creator: account.address, status: OfferStatus.FILLED }),
        getOffers({ creator: account.address, status: `${OfferStatus.REPAID},${OfferStatus.LIQUIDATED}` }),
      ]);

      for (let loan of res1.data) {
        loan.order = loan.hash;
      }

      for (let loan of res2.data) {
        const { data } = await getOrderByHash(loan.order);
        loan.metadata = data.metadata;
      }

      for (let loan of res3.data) {
        loan.order = loan.hash;
      }

      for (let loan of res4.data) {
        const { data } = await getOrderByHash(loan.order);
        loan.metadata = data.metadata;
      }

      for (let loan of res5.data) {
        const { data } = await getOrderByHash(loan.order);
        loan.metadata = data.metadata;
      }

      for (let loan of res6.data) {
        const { data } = await getOrderByHash(loan.order);
        loan.metadata = data.metadata;
      }

      setLoans({
        current: [...res1.data, ...res2.data],
        previous: [...res3.data, ...res4.data, ...res6.data],
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (account.address) {
      fetchLoans();
    }
  }, [account.address]);

  return (
    <div className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      {selectedLoan &&
        (offerViewType === FormType.VIEW ? (
          <OfferView item={selectedLoan} onClose={setSelectedLoan} />
        ) : (
          <OfferView
            item={selectedLoan}
            onClose={setSelectedLoan}
            action={{ text: 'Repay', handle: handleRepayOffer }}
          />
        ))}
      <Table
        title="Current Loans"
        data={loans.current}
        action={{ text: 'View', handle: (item) => handleViewOffer(item, FormType.EDIT) }}
        type="HISTORY"
      />
      <Table
        title="Previous Loans"
        data={loans.previous}
        action={{ text: 'View', handle: (item) => handleViewOffer(item, FormType.VIEW) }}
        type="HISTORY"
      />
    </div>
  );
}
