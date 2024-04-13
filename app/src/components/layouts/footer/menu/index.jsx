import { Link } from 'react-router-dom';
import styles from '../styles.module.scss';
import { FOOTER_MENU } from '@src/constants';

export default function Menu() {
  return (
    <div className={styles.menu}>
      {FOOTER_MENU.map((menu, index) => (
        <ul className={styles['menu-list']} key={index}>
          <li className={styles['menu-title']}>{menu.title}</li>
          {menu.items.map((item, i) => (
            <li className={styles['menu-item']} key={i}>
              <Link className={styles['menu-item-link']} to={item.link}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
