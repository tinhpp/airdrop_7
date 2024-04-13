/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import Table from '@src/components/common/request-table';
import styles from './styles.module.scss';
import { getRequests } from '../../../api/request.api';
import RequestPopup from '../../common/request-popup';

export default function Requests() {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const { data: requests } = await getRequests({ creator: account.address });
      setRequests(requests);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [account.address]);

  const onClose = async () => {
    setSelectedRequest(null);
    await fetchRequests();
  };

  return (
    <div className={styles.container}>
      {selectedRequest && (
        <RequestPopup
          item={selectedRequest}
          onClose={onClose}
          // action={{ text: 'Cancel', handle: handleCancelOffer }}
        />
      )}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <Table title="Requests sent" data={requests} action={{ text: 'View', handle: setSelectedRequest }} />
      )}
    </div>
  );
}
