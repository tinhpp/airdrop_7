/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { ethers } from 'ethers';
import {
  convertOfferDataToSign,
  generateOfferSignature,
  calculateAPR,
  calculateRepayment,
  checkAllowance,
  approveERC20,
  parseMetamaskError,
} from '@src/utils';
import { createOffer } from '@src/api/offer.api';
import styles from '../styles.module.scss';

export default function Form({ order, fetchOffers }) {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    currency: account.currency,
    amount: 0,
    duration: 0,
    repayment: 0,
    apr: 0,
    expiration: 0,
  });

  const handleChange = (e) => {
    const newData = {
      ...data,
      [e.target.name]: e.target.value,
    };

    if (['amount', 'duration', 'repayment'].includes(e.target.name)) {
      newData.apr = calculateAPR(newData.amount, newData.repayment, newData.duration);
    } else {
      newData.repayment = calculateRepayment(newData.amount, newData.apr, newData.duration);
    }

    setData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (Object.values(data).includes(0)) return;
      if (order.creator.toLowerCase() == account.address.toLowerCase()) {
        toast.error('Can not make offer. You are the owner of this collateral!');
        setIsLoading(false);
        return;
      }

      const offer = {
        creator: account.address,
        order: order.hash,
        borrower: order.creator,
        offer: data.amount,
        duration: data.duration,
        rate: data.apr,
        expiration: data.expiration,
        createdAt: new Date().getTime(),
      };

      offer.nftAddress = order.nftAddress;
      offer.nftTokenId = order.nftTokenId;

      const { offerData, signatureData } = convertOfferDataToSign(offer);
      const signature = await generateOfferSignature(offerData, signatureData);
      signatureData.signature = signature;
      offer.signature = signatureData;
      offer.adminFeeInBasisPoints = offerData.adminFeeInBasisPoints;
      offer.erc20Denomination = offerData.erc20Denomination;
      // check allowance and approve erc20
      if (!(await checkAllowance(account.address, ethers.utils.parseUnits(data.amount, 18)))) {
        const tx = await approveERC20(ethers.utils.parseUnits(data.amount, 18));
        await tx.wait();
      }
      await toast.promise(createOffer(offer), {
        loading: 'Making offer...',
        success: <b style={{ color: '#000' }}>Make offer successfully!</b>,
        error: <b style={{ color: '#000' }}>An error has been occurred!</b>,
      });
      setData({
        currency: account.currency,
        amount: 0,
        duration: 0,
        repayment: 0,
        apr: 0,
        expiration: 0,
      });
      fetchOffers();
      setIsLoading(false);
    } catch (error) {
      const txError = parseMetamaskError(error);
      setIsLoading(false);
      toast.error(txError.context);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.title}>Make offer</div>
      <div className={styles.section}>
        <div className={styles.head}>
          Amount:{' '}
          <span>
            {data.amount} {data.currency}
          </span>
        </div>
        <div className={styles.details}>
          <div className={styles.label}>What loan amount are you offering?</div>
          <label className={styles.input}>
            <input
              required={true}
              type="number"
              value={data.amount}
              name="amount"
              onChange={handleChange}
              checked={true}
            />
          </label>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.head}>
          Loan duration: <span>{data.duration} days</span>
        </div>
        <div className={styles.details}>
          <div className={styles.label}>What loan duration are you offering?</div>
          <label className={styles.input}>
            <input required={true} type="number" value={data.duration} name="duration" onChange={handleChange} />
            <span>days</span>
          </label>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.head}>
          Repayment:{' '}
          <span>
            {data.repayment} {data.currency} ({data.apr}% APR)
          </span>
        </div>
        <div className={styles.details}>
          <div className={styles.label}>What APR are you offering?</div>
          <label className={styles.input}>
            <input
              required={true}
              className={styles['repayment-input']}
              type="number"
              value={data.repayment}
              name="repayment"
              onChange={handleChange}
            />
            <input
              required={true}
              className={styles['apr-input']}
              type="number"
              value={data.apr}
              name="apr"
              onChange={handleChange}
            />
            <div className={styles['percent-label']}>%</div>
          </label>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.head}>
          Offer expiration: <span>{data.expiration} days</span>
        </div>
        <div className={styles.details}>
          <div className={styles.label}>Specify an expiration period for this offer?</div>
          <label className={styles.input}>
            <input required={true} type="number" value={data.expiration} name="expiration" onChange={handleChange} />
            <span>days</span>
          </label>
        </div>
      </div>
      <div className={styles['button-wrap']}>
        <button type="submit">Make offer</button>
      </div>
    </form>
  );
}
