import { getSales } from '@src/api/nfts.api';
import { useQuery } from '@tanstack/react-query';
import { ConfigProvider, List, Tabs, Pagination } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Product from './product';
import styles from './styles.module.scss';

const onChange = (key) => {
  console.log(key);
};
const items = [
  // {
  //   key: '1',
  //   label: 'Collections',
  //   disabled: true,
  // },
  {
    key: '2',
    label: 'NFTs',
  },
];

export default function Marketplace() {
  const [currentPage, setPage] = useState(1);
  const { status, data, refetch } = useQuery(['listMarketplaceItems', { currentPage }], () => getSales({ status: 0, page: currentPage }));

  const changePage = (key) => {
    setPage(key);
  };

  useEffect(() => {
    if (status === 'success') {
      refetch();
    }
  }, [refetch, status]);

  const sales = useMemo(
    () => data?.data.itemsFiltered.map(({ metadata, ...item }) => ({ ...JSON.parse(metadata ?? ''), ...item })),
    [data]
  );

  return (
    <div className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.heading}>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                titleFontSize: 20,
                itemActiveColor: '#ffffff',
                inkBarColor: '#ffffff',
                itemSelectedColor: '#ffffff',
                colorBorderSecondary: '#221e37',
              },
            },
          }}
        >
          <Tabs defaultActiveKey="2" items={items} onChange={onChange} />
        </ConfigProvider>
      </div>
      <List
        grid={{
          gutter: 16,
          column: 4,
        }}
        dataSource={sales}
        renderItem={(item) => (
          <List.Item>
            <Product nftInfo={item} />
          </List.Item>
        )}
      />
      <div style={{
        marginTop: '2%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Pagination onChange={changePage} defaultCurrent={currentPage} total={data?.data.total} />
      </div>
    </div>
  );
}