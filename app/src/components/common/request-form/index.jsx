/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import ReactLoading from 'react-loading';
import styles from './styles.module.scss';
import toast, { Toaster } from 'react-hot-toast';
import { createRequest } from '../../../api/request.api';
import { convertRequestDataToSign } from '../../../utils/misc';
import { LOAN_ADDRESS, CHAIN_ID } from '../../../constants/contract';
import { generateRequestSignature } from '../../../utils/ethers';

export default function RequestForm({ item, onClose, type }) {
  const ref = useRef(null);
  const account = useSelector((state) => state.account);

  const [data, setData] = useState({
    duration: 0,
    fee: 0,
    expiry: 0,
    currency: account.currency,
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useOnClickOutside(ref, () => onClose());

  const handleChange = (e) => {
    const newData = {
      ...data,
      [e.target.name]: e.target.value,
    };

    setData(newData);
  };

  const handleCreateRenegotiation = async () => {
    try {
      setIsLoading(true);
      const request = {
        creator: account.address,
        loanId: item.order.hash,
        offer: item.hash,
        loanDuration: data.duration,
        renegotiateFee: data.fee,
        expiration: data.expiry,
        loanContract: LOAN_ADDRESS,
        chainId: CHAIN_ID,
        lender: item.creator,
        reason: data.reason,
      };
      const { requestData, signatureData } = convertRequestDataToSign(request);
      signatureData.signer = account.address;

      const signature = await generateRequestSignature(requestData, signatureData);
      request.signature = {
        ...signatureData,
        signature,
      };

      await createRequest(request);
    } catch (error) {
      console.log(error);
      toast.error('An error has been occured!');
    } finally {
      setIsLoading(false);
      onClose(true);
    }
  };

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
          {/* <span>{type === COLLATERAL_FORM_TYPE.VIEW ? 'View' : 'List'} Collateral</span>
          {type === COLLATERAL_FORM_TYPE.VIEW && item.lender === 'user' && (
            <Link to={`/assets/${item.hash}`}>
              <Icon icon="uil:edit" />
            </Link>
          )} */}
        </div>
        <div className={styles['sub-title']}>Loan renegotiation</div>
        {/* {!isPermittedNFT && (
          <div className={styles['error-text']}>This collection has not been permitted on this system.</div>
        )} */}
        <div className={styles.section}>
          <div className={styles.head}>
            Loan value:{' '}
            <span>
              {item.offer} {account.currency}
            </span>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Loan duration: <span>{item.duration} days</span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What loan duration do you want to renegotiate?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.duration}
                name="duration"
                onChange={handleChange}
                readOnly={type === 'view'}
              />
              <span>days</span>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.details}>
            <div className={styles.label}>What renegotiation fee that you want to pay?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.fee}
                name="fee"
                onChange={handleChange}
                checked={true}
                readOnly={type === 'view'}
              />
              <span>{account.currency}</span>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.details}>
            <div className={styles.label}>The loan renegotiation will be expired in</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.expiry}
                name="expiry"
                onChange={handleChange}
                readOnly={type === 'view'}
              />
              <span>days</span>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Lender: <span>{item.order.lender === 'user' ? 'User' : 'Lending Pool'}</span>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.details}>
            <div className={styles.label}>Reason:</div>
            <textarea value={data.reason} onChange={handleChange} name="reason" />
          </div>
        </div>
        <div className={styles['button-wrap']}>
          <button type="button" onClick={() => handleCreateRenegotiation()}>
            Submit
          </button>
          <button type="button" onClick={() => onClose()}>
            Close
          </button>

          {/* {item.lender === 'pool' ? (
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
          )} */}
        </div>
      </form>
    </div>
  );
}
