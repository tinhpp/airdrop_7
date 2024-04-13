/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';
import {
  mintERC721,
  createTokenBoundAccount,
  getTokenBoundAccount,
  ERC721Contract,
  parseMetamaskError,
} from '@src/utils';
import { DEFAULT_ERC6551_BASE_URI, TOKEN_BOUND_ACCOUNT_NFT_ADDRESS } from '@src/constants';
import { createTokenBoundAccount as createTokenBoundAccountApi } from '@src/api/token-bound-account.api';
import URLForm from './url-form';
import styles from './styles.module.scss';

export default function ERC6551Form({ onClose }) {
  const account = useSelector((state) => state.account);

  const ref = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [openUrlForm, setOpenUrlForm] = useState(false);
  const [data, setData] = useState({
    account: '',
    registryAddress: '',
    implementationAddress: '',
    tokenAddress: '',
    tokenId: '',
    salt: 100,
  });

  const handleChange = async (e) => {
    // eslint-disable-next-line no-unused-vars
    const { account, ...newData } = {
      ...data,
      [e.target.name]: String(e.target.value).toLowerCase(),
    };

    if (!Object.values(newData).includes('')) {
      try {
        const importedAccount = await getTokenBoundAccount(newData);
        newData.account = importedAccount;
      } catch (error) {
        console.log('error', error);
      }
    } else {
      newData.account = '';
    }

    setData(newData);
  };

  const handleCreateERC6551 = async (url = DEFAULT_ERC6551_BASE_URI) => {
    setIsLoading(true);
    try {
      const tx = await mintERC721(account.address, url, TOKEN_BOUND_ACCOUNT_NFT_ADDRESS);
      const receipt = await tx.wait();
      const args = receipt.events.find((ev) => ev.event === 'Transfer').args;
      const tokenId = parseInt(args[2], 16);
      const result = await createTokenBoundAccount(tokenId);
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const erc721Contract = await ERC721Contract(data.tokenAddress);
      const isOwnerOfTokenId =
        (await erc721Contract.ownerOf(data.tokenId)).toLowerCase() === account.address.toLowerCase();
      if (!isOwnerOfTokenId) {
        toast.error(`You are not owner of the Token ID: ${data.tokenId}`);
        setIsLoading(false);
        return;
      }
      await createTokenBoundAccountApi({ ...data, owner: account.address });
      toast.success('Import ERC-6551 Account successfully');
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
        {openUrlForm && <URLForm onClose={() => setOpenUrlForm(false)} handleCreateERC6551={handleCreateERC6551} />}
        <div className={styles.title}>Import your Token Bound Account</div>
        <div className={styles['sub-title']}>Provide opportunity to access a larger loan</div>
        <div className={styles.section}>
          <div className={styles.head}>Imported Account Address: {data.account}</div>
          <div className={styles.details}>
            <div className={styles.label}>Registry address:</div>
            <label className={styles.input}>
              <input type="text" value={data.registryAddress} name="registryAddress" onChange={handleChange} required />
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.details}>
            <div className={styles.label}>Implementation address:</div>
            <label className={styles.input}>
              <input
                type="text"
                value={data.implementationAddress}
                name="implementationAddress"
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.details}>
            <div className={styles.label}>Token address (ERC-721):</div>
            <label className={styles.input}>
              <input type="text" value={data.tokenAddress} name="tokenAddress" onChange={handleChange} required />
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.details}>
            <div className={styles.label}>Token ID:</div>
            <label className={styles.input}>
              <input type="text" value={data.tokenId} name="tokenId" onChange={handleChange} required />
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.details}>
            <div className={styles.label}>Salt:</div>
            <label className={styles.input}>
              <input type="number" min={100} value={data.salt} name="salt" onChange={handleChange} required />
            </label>
          </div>
        </div>
        <div className={`${styles['sub-title']} ${styles['sub-title-button']}`}>
          Don&apos;t have an ERC-6551 account yet?
          <button type="button" onClick={() => setOpenUrlForm(true)}>
            Create now
          </button>
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
