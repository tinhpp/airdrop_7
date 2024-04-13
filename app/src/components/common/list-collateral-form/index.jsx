/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { ethers } from 'ethers';
import { getNFTPermit } from '@src/utils';
import { createOrder } from '@src/api/order.api';
import { getVote } from '@src/api/vote.api';
import {
  generateOrderSignature,
  calculateAPR,
  calculateRepayment,
  checkApproved,
  approveERC721,
  parseMetamaskError,
  acceptOfferLendingPool,
} from '@src/utils';
import { COLLATERAL_FORM_TYPE, WXCR_ADDRESS, LOAN_ADDRESS, ONE_DAY } from '@src/constants';
import styles from './styles.module.scss';

export default function ListCollateralForm({ item, onClose, type }) {
  const account = useSelector((state) => state.account);

  const ref = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isPermittedNFT, setIsPermittedNFT] = useState(true);
  const [data, setData] = useState({
    currency: account.currency,
    offer: 0,
    duration: 0,
    repayment: 0,
    apr: 0,
    lender: 'user',
  });

  const calculatePercentVote = (input, total) => {
    return ((input * 100) / total).toFixed(2);
  };

  const handleChange = (e) => {
    const newData = {
      ...data,
      [e.target.name]: e.target.value,
    };

    if (['offer', 'duration', 'repayment'].includes(e.target.name)) {
      newData.apr = calculateAPR(newData.offer, newData.repayment, newData.duration);
    } else if (e.target.name === 'apr') {
      newData.repayment = calculateRepayment(newData.offer, newData.apr, newData.duration);
    }

    setData(newData);
  };

  const handleGetLoan = async () => {
    try {
      setIsLoading(true);

      const repayment = calculateRepayment(item.offer, item.rate, item.duration);

      const offer = {
        principalAmount: ethers.utils.parseUnits(item.offer, 18),
        maximumRepaymentAmount: ethers.utils.parseUnits(`${repayment}`, 18),
        nftCollateralId: item.nftTokenId,
        nftCollateralContract: item.nftAddress,
        duration: item.duration * ONE_DAY,
        adminFeeInBasisPoints: 25,
        erc20Denomination: WXCR_ADDRESS,
      };

      const { data } = await getVote({ orderHash: item.hash, isAccepted: true });
      const signatures = data.map((item) => item.signature);
      const tx = await acceptOfferLendingPool(item.hash, offer, signatures);
      await tx.wait();
      toast.success('Get loan successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      setIsLoading(false);
      toast.error(txError.context);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (type === COLLATERAL_FORM_TYPE.VIEW) {
        console.log('Unlist', item);
      } else {
        if (Object.values(data).includes(0)) {
          toast.error('Please fill required information!');
          setIsLoading(false);
          return;
        }
        const order = {
          creator: account.address,
          nftAddress: item.collectionAddress,
          nftTokenId: item.edition,
          offer: data.offer,
          duration: data.duration,
          rate: data.apr,
          lender: data.lender,
        };
        const signature = await generateOrderSignature(order);
        order.signature = signature;
        order.metadata = {
          name: item.name,
          image: item.image,
          collection: item.collection,
        };

        if (item.hash) order.metadata.hash = item.hash;

        if (!(await checkApproved(item.edition, LOAN_ADDRESS, item.collectionAddress))) {
          const tx = await approveERC721(item.edition, LOAN_ADDRESS, item.collectionAddress);
          await tx.wait();
        }

        await createOrder(order);

        toast.success('List collateral successfully!');
        setTimeout(() => {
          onClose(true);
        }, 1000);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('An error has been occurred!');
      console.log('error', error);
    }
  };

  useOnClickOutside(ref, () => onClose());

  useEffect(() => {
    if (type === COLLATERAL_FORM_TYPE.VIEW) {
      setData({
        currency: account.currency,
        offer: item.offer,
        duration: item.duration,
        repayment: calculateRepayment(item.offer, item.rate, item.duration),
        apr: item.rate,
        lender: item.lender,
      });
    } else {
      getNFTPermit(item.collectionAddress).then(setIsPermittedNFT);
    }
  }, []);

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <form className={styles.form} onSubmit={handleSubmit} ref={ref}>
        <div className={styles.title}>
          <span>{type === COLLATERAL_FORM_TYPE.VIEW ? 'View' : 'List'} Collateral</span>
          {type === COLLATERAL_FORM_TYPE.VIEW && item.lender === 'user' && (
            <Link to={`/assets/${item.hash}`}>
              <Icon icon="uil:edit" />
            </Link>
          )}
        </div>
        <div className={styles['sub-title']}>Proposed loan agreement</div>
        {!isPermittedNFT && (
          <div className={styles['error-text']}>This collection has not been permitted on this system.</div>
        )}
        <div className={styles.section}>
          <div className={styles.head}>
            Amount:{' '}
            <span>
              {data.offer} {data.currency}
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What loan offer are you offering?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.offer}
                name="offer"
                onChange={handleChange}
                checked={true}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}
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
              <input
                type="number"
                value={data.duration}
                name="duration"
                onChange={handleChange}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}
              />
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
                className={styles['repayment-input']}
                type="number"
                value={data.repayment}
                name="repayment"
                onChange={handleChange}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}
              />
              <input
                className={styles['apr-input']}
                type="number"
                value={data.apr}
                name="apr"
                onChange={handleChange}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}
              />
              <div className={styles['percent-label']}>%</div>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Lender: <span>{data.lender === 'user' ? 'User' : 'Lending Pool'}</span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>Where do you want to borrow from ?</div>
            <div className={styles.select}>
              <label className={styles.input}>
                <input
                  type="radio"
                  value="user"
                  name="lender"
                  onChange={handleChange}
                  checked={data.lender === 'user'}
                  disabled={data.lender !== 'user' && type === COLLATERAL_FORM_TYPE.VIEW}
                />
                <span>User</span>
              </label>
              <label className={styles.input}>
                <input
                  type="radio"
                  value="pool"
                  name="lender"
                  onChange={handleChange}
                  checked={data.lender === 'pool'}
                  disabled={data.lender !== 'pool' && type === COLLATERAL_FORM_TYPE.VIEW}
                />
                <span>Lending Pool</span>
              </label>
            </div>
          </div>
        </div>
        {type === COLLATERAL_FORM_TYPE.VIEW && item.lender === 'pool' && (
          <div className={styles.section}>
            <div className={styles.head}>
              Status: <span>{calculatePercentVote(item.vote.accepted, item.vote.total) >= 75 ? 'Accepted' : ''}</span>
              <span>{calculatePercentVote(item.vote.rejected, item.vote.total) > 25 ? 'Rejected' : ''}</span>
            </div>
            <div className={styles.details}>
              <span>
                {' '}
                {calculatePercentVote(item.vote.accepted, item.vote.total)}% Accepted -{' '}
                {calculatePercentVote(item.vote.rejected, item.vote.total)}% Rejected
              </span>
            </div>
          </div>
        )}
        <div className={styles['button-wrap']}>
          <button type="button" onClick={() => onClose()}>
            Close
          </button>

          {item.lender === 'pool' ? (
            <button
              type="button"
              className={styles['get-loan-btn']}
              disabled={calculatePercentVote(item.vote.accepted, item.vote.total) < 75}
              onClick={handleGetLoan}
            >
              Get loan
            </button>
          ) : (
            <button type="submit" disabled={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}>
              {type === COLLATERAL_FORM_TYPE.VIEW ? 'Unlist' : 'List'} Collateral
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
