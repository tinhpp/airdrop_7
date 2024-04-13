import styles from './styles.module.scss';

export default function ConnectMetamask({ handleAccountsChanged, requireSwitchNetwork }) {
  const handleClick = () => {
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

  return (
    <div className={styles.container}>
      <button onClick={handleClick}>Connect metamask and switch CVC Network</button>
    </div>
  );
}
