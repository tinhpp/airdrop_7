import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { PermittedNFTsContract } from '@src/utils';
import Table from './table';

export default function AdminCollections() {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);

  useEffect(() => {
    const permittedNFTsContract = PermittedNFTsContract();
    permittedNFTsContract.owner().then((owner) => {
      if (owner.toLowerCase() !== account.address.toLowerCase()) {
        navigate('/');
      }
    });
  }, [account]);

  return <Table />;
}
