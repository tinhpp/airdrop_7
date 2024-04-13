/* eslint-disable react/prop-types */
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { getStakedByUser } from '@src/utils/contracts/lending-pool';
import styles from './styles.module.scss';
import cvcScanIcon from '@src/assets/cvcscan-icon.png';

export default function HeaderBanner({ title = '', description = '', tabs = [], right = true }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const account = useSelector((state) => state.account);

  const handleNavigate = async (url) => {
    try {
      if (url === '/lending-pool/requests') {
        const balance = await getStakedByUser(account.address);
        if (balance == 0) {
          toast.error('You must stake to Lending Pool to use this feature!', {
            duration: 3000,
            style: {
              fontWeight: 600,
            },
          });
          return;
        }
      }
      navigate(url);
    } catch (error) {
      toast.error('An error has been occurred!', {
        duration: 3000,
        style: {
          fontWeight: 600,
        },
      });
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.header}>
        <div className={styles.left}>
          {pathname.startsWith('/profile') || pathname.startsWith('/admin') ? (
            <>
              <h1>{pathname.startsWith('/admin') ? 'Administrator' : 'Account'}</h1>
              <div className={styles.address}>{account.address}</div>
              <div className={styles.social}>
                <Link
                  className={styles['social-item']}
                  to={`https://testnet.cvcscan.com/address/${account.address}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={cvcScanIcon} alt="CVCScan" />
                  <span>CVCScan</span>
                </Link>
                <Link className={styles['social-item']} to={`#`} rel="noreferrer" target="_blank">
                  <Icon icon="logos:twitter" fontSize={18} />
                  <span>Twitter</span>
                </Link>
                <Link className={styles['social-item']} to={`#`} rel="noreferrer" target="_blank">
                  <Icon icon="logos:facebook" fontSize={18} />
                  <span>Facebook</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>{title}</h1>
              <div className={styles.description}>{description}</div>
            </>
          )}
        </div>
        {right && (
          <div className={styles.right}>
            <div>
              <div className={styles['right-item']}>
                <div className={styles['right-item-left']}>Balance:</div>
                <div>
                  {account.balance} {account.currency}
                </div>
              </div>
              <div className={styles['right-item']}>
                <div className={styles['right-item-left']}>Borrow:</div>
                <div>0</div>
              </div>
              <div className={styles['right-item']}>
                <div className={styles['right-item-left']}>Lend:</div>
                <div>0</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {tabs.length > 0 && (
        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`${styles['tab-item']} ${pathname === tab.url ? styles.active : ''}`}
              onClick={() => handleNavigate(tab.url)}
            >
              {tab.text}
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}
