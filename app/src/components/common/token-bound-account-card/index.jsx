/* eslint-disable react/prop-types */
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOnClickOutside } from 'usehooks-ts';
import ReactLoading from 'react-loading';
import { ethers } from 'ethers';
import { getTokenBoundAccount, ERC721Contract, ERC20Contract, getBalance, sliceHeadTail, provider } from '@src/utils';
import { WEAPON_NFT_ADDRESS, GOLD_ERC20_ADDRESS, SILVER_ERC20_ADDRESS } from '@src/constants';
import { ERC721_WEAPON_ABI } from '@src/abi/erc721';

import styles from './styles.module.scss';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function TokenBoundAccountCard({ item, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [tbaAddress, setTbaAddress] = useState('');
  const [assets, setAssets] = useState({
    nfts: [],
    tokens: [],
  });

  const ref = useRef(null);

  const handleFetchAssets = async () => {
    try {
      const currentTbaAddress = await getTokenBoundAccount(item.tokenBoundAccount);
      const erc721 = ERC721Contract(WEAPON_NFT_ADDRESS, provider, ERC721_WEAPON_ABI);
      const listNFTs = await erc721.tokensOfOwner(currentTbaAddress);
      const tokenURIs = await Promise.all(listNFTs.map((tokenId) => erc721.tokenURI(tokenId)));
      const nftData = (await Promise.all(tokenURIs.map((uri) => axios.get(uri)))).map((res) => res.data);

      const goldContract = ERC20Contract(GOLD_ERC20_ADDRESS);
      const silverContract = ERC20Contract(SILVER_ERC20_ADDRESS);

      const [wXCR, GOLD, SILVER] = await Promise.all([
        getBalance(currentTbaAddress),
        goldContract.balanceOf(currentTbaAddress),
        silverContract.balanceOf(currentTbaAddress),
      ]);

      const tokensData = [
        {
          name: 'wXCR',
          value: wXCR,
        },
        {
          name: 'GOLD',
          value: Number(ethers.utils.formatEther(GOLD)).toFixed(2),
        },
        {
          name: 'SILVER',
          value: Number(ethers.utils.formatEther(SILVER)).toFixed(2),
        },
      ];

      setAssets({ tokens: tokensData, nfts: nftData });
      setTbaAddress(currentTbaAddress);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useOnClickOutside(ref, () => onClose());

  useEffect(() => {
    handleFetchAssets();
  }, []);

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <div className={styles.form} ref={ref}>
        <div className={styles.left}>
          <div className={styles['item-name']}>
            {item.metadata.name}{' '}
            <Link to={`${CVC_SCAN}/address/${tbaAddress}`} target="_blank">
              ({sliceHeadTail(tbaAddress, 5)})
            </Link>
          </div>
          <img src={item.metadata.image} />
        </div>
        <div className={styles.right}>
          <div className={styles['tab-list']}>
            <div className={`${styles.tab} ${activeTab === 1 ? styles.active : ''}`} onClick={() => setActiveTab(1)}>
              Collectibles
            </div>
            <div className={`${styles.tab} ${activeTab === 2 ? styles.active : ''}`} onClick={() => setActiveTab(2)}>
              Assets
            </div>
          </div>
          <div className={styles['list-assets']}>
            {activeTab === 1 ? (
              <div className={styles['list-nfts']}>
                {assets.nfts.length > 0 ? assets.nfts.map((item, index) => (
                  <img src={item.image} key={index} />
                )) : <div>There are no assets.</div>}
              </div>
            ) : (
              <div className={styles['list-tokens']}>
                {assets.tokens.map((item, index) => (
                  <div className={styles['token-item']} key={index}>
                    <span>{item.name}:</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
