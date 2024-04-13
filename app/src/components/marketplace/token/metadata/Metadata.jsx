import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge, StyledTabs } from '../styled';
import Overview from './Overview';
import Properties from './Properties';
import Bids from './Bids';
import History from './History';

export const Metadata = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  const items = useMemo(
    () => [
      {
        key: 'overview',
        label: 'Overview',
        children: <Overview />,
      },
      {
        key: 'properties',
        label: (
          <div className="prop">
            Properties <Badge showZero count={0} />
          </div>
        ),
        children: <Properties />,
      },
      {
        key: 'bids',
        label: 'Bids',
        children: <Bids />,
      },
      {
        key: 'history',
        label: 'Activity',
        children: <History />,
      },
    ],
    []
  );

  return (
    <div>
      <StyledTabs
        defaultActiveKey="overview"
        activeKey={tab}
        items={items}
        onChange={(tab) => setSearchParams({ tab })}
      />
    </div>
  );
};

export default Metadata;
