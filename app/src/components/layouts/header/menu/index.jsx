import { Link } from 'react-router-dom';
import styles from '../styles.module.scss';
import { HEADER_MENU } from '@src/constants';
import { useLocation } from 'react-router-dom';

export default function Menu({ isAdmin }) {
  const { pathname } = useLocation();

  const isActiveLink = (menu) => {
    if (menu.items) {
      const item = menu.items.find((item) => item.link === pathname);
      return !!item;
    }
    return pathname.startsWith(menu.link);
  };

  return (
    <div className={styles.menu}>
      <ul className={styles['menu-list']}>
        {HEADER_MENU.map((menu, index) =>
          menu.items ? (
            <li className={styles['menu-item']} key={index}>
              <Link to="#" className={`${styles['menu-item-link']} ${isActiveLink(menu) ? styles.active : ''}`}>
                {menu.title}
              </Link>
              <ul className={styles['sub-menu']}>
                {menu.items.map((item, i) => (
                  <li className={styles['sub-menu-item']} key={i}>
                    <Link
                      to={item.link}
                      className={`${styles['sub-menu-item-link']} ${isActiveLink(item) ? styles.active : ''}`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li className={styles['menu-item']} key={index}>
              <Link to={menu.link} className={`${styles['menu-item-link']} ${isActiveLink(menu) ? styles.active : ''}`}>
                {menu.title}
              </Link>
            </li>
          )
        )}
        {isAdmin && (
          <li className={styles['menu-item']}>
            <Link
              to="/admin/collections"
              className={`${styles['menu-item-link']} ${isActiveLink({ link: '/admin' }) ? styles.active : ''}`}
            >
              Admin
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
