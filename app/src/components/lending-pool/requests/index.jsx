import { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getStakedByUser } from '@src/utils/contracts/lending-pool';
import { getOrders } from '@src/api/order.api';
import { OrderStatus, FormType } from '@src/constants';
import Table from '@src/components/common/table';
import Form from './form';
import styles from './styles.module.scss';

export default function LoanRequests() {
  const navigate = useNavigate();

  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState({
    request: [],
    current: [],
    previous: [],
  });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loanFormType, setLoanFormType] = useState(FormType.EDIT);

  const fetchOrders = async () => {
    try {
      const [orderList1, orderList2, orderList3] = await Promise.all([
        getOrders({ lender: 'pool', status: OrderStatus.OPENING }),
        getOrders({ lender: 'pool', status: OrderStatus.FILLED }),
        getOrders({
          lender: 'pool',
          status: `${OrderStatus.CANCELLED},${OrderStatus.REPAID},${OrderStatus.LIQUIDATED},${OrderStatus.REJECTED}`,
        }),
      ]);

      setOrderList({
        request: orderList1.data,
        current: orderList2.data,
        previous: orderList3.data,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleSelectLoan = (loan, type) => {
    setSelectedLoan(loan);
    setLoanFormType(type);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (account.address) {
      getStakedByUser(account.address).then((balance) => {
        if (balance == 0) navigate('/lending-pool');
      });
    }
  }, [account.address]);

  return (
    <div className={styles.container}>
      {selectedLoan && <Form item={selectedLoan} onClose={setSelectedLoan} type={loanFormType} />}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <>
          <Table
            title="Loan Requests"
            data={orderList.request}
            action={{ text: 'View', handle: (loan) => handleSelectLoan(loan, FormType.EDIT) }}
          />
          <Table
            title="Current loans"
            data={orderList.current}
            action={{ text: 'View', handle: (loan) => handleSelectLoan(loan, FormType.EDIT) }}
          />
          <Table
            title="Previous loans"
            data={orderList.previous}
            action={{ text: 'View', handle: (loan) => handleSelectLoan(loan, FormType.VIEW) }}
          />
        </>
      )}
    </div>
  );
}
