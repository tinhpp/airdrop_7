import Player from '@src/components/common/Player';
import Info from './Info';
import { Metadata } from './metadata';
import { WrapperTokenDetail } from './styled';
import { useTokenDetail } from './useTokenDetail';

const TokenDetail = () => {
  const { token } = useTokenDetail();

  return (
    <WrapperTokenDetail>
      <div className="left-panel">
        <div className="hero">
          <Player src={token?.image} />
        </div>
        <Metadata />
      </div>
      <div className="right-panel">
        <Info />
      </div>
    </WrapperTokenDetail>
  );
};

export default TokenDetail;
