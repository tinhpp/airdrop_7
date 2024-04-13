/* eslint-disable react/prop-types */
import { parseMetamaskError } from '@src/utils';
import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import { importCollection } from '@src/api/nfts.api';
import styles from './styles.module.scss';
import { isAddress } from 'ethers/lib/utils';

export default function ERC721Form({ onClose }) {
  const account = useSelector((state) => state.account);

  const ref = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.target);
      const collectionAddress = formData.get('collectionAddress').toLowerCase();

      if (!isAddress(collectionAddress)) throw new Error('Invalid collection address');

      const res = await importCollection({ collectionAddress, from: account.address });

      toast.success(res.data.message);
      setIsLoading(false);
      onClose(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
    }
  };

  useOnClickOutside(ref, () => onClose());

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <form className={styles.form} onSubmit={handleSubmit} ref={ref}>
        <div className={styles.title}>Import your NFT Collection</div>
        <div className={styles['sub-title']}>Easier to make a loan with your NFTs</div>
        <div className={styles.section}>
          <div className={styles.head}>Your Account Address: {account.address}</div>
          <div className={styles.details}>
            <div className={styles.label}>NFT Collection Address:</div>
            <label className={styles.input}>
              <input type="text" name="collectionAddress" required />
            </label>
          </div>
        </div>
        <div className={styles['button-wrap']}>
          <button type="button" onClick={() => onClose()}>
            Cancel
          </button>
          <button type="submit" className={styles['get-loan-btn']}>
            Import
          </button>
        </div>
      </form>
    </div>
  );
}
