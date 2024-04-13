import { useState, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { DEFAULT_ERC6551_BASE_URI } from '@src/constants';
import styles from '../styles.module.scss';

export default function URLForm({ onClose, handleCreateERC6551 }) {
  const [url, setUrl] = useState('');

  const ref = useRef(null);

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = () => {
    if(!url) return;
    handleCreateERC6551(url);
    onClose();
  };

  useOnClickOutside(ref, () => onClose());

  return (
    <div className={styles['url-form']}>
      <div className={styles['url-form-wrap']} ref={ref}>
        <div className={styles['url-form-title']}>Enter Token URI:</div>
        <div className={styles['url-form-input-wrap']}>
          <input value={url} onChange={handleChange} />
          <button onClick={() => setUrl(DEFAULT_ERC6551_BASE_URI)} type="button">
            Default
          </button>
        </div>
        <div className={styles['url-form-button']}>
          <button className={styles['url-button-cancel']} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles['url-create-create']} type="button" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
