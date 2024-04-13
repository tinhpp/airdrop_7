import { ShoppingCart } from '@src/components/shopping-cart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Account from './account';
import Menu from './menu';
import styles from './styles.module.scss';
import CreateLink from '@src/components/marketplace/create/CreateLink';
import { PermittedNFTsContract } from '@src/utils';

export default function Header({ handleAccountsChanged, requireSwitchNetwork }) {
  const account = useSelector((state) => state.account);

  const [darkBackground, setDarkBackground] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setDarkBackground(true);
    } else {
      setDarkBackground(false);
    }
  };

  const handleConnectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          console.error(err);
        });

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      requireSwitchNetwork();
    } else {
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    }
  };

  useEffect(() => {
    changeBackground();
    window.addEventListener('scroll', changeBackground);

    return () => window.removeEventListener('scroll', changeBackground);
  });

  useEffect(() => {
    const permittedNFTsContract = PermittedNFTsContract();
    permittedNFTsContract.owner().then((owner) => setIsAdmin(owner.toLowerCase() === account.address.toLowerCase()));
  }, [account]);

  return (
    <div className={`${styles.header} ${darkBackground ? styles.dark : ''}`}>
      <Link to="/" className={styles.logo}>
        AvengersFI
      </Link>
      <Menu isAdmin={isAdmin} />
      <div className={styles.account}>
        <CreateLink />
        {account.address ? (
          <Account account={account} />
        ) : (
          <button onClick={handleConnectWallet}>Connect Wallet</button>
        )}
        <ShoppingCart />
      </div>
    </div>
  );
}
