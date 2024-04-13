import { Description } from '@src/components/common/Description';
import { WrapperOverview } from '../styled';
import { FaRegEye } from 'react-icons/fa';
import { useTokenDetail } from '../useTokenDetail';

export const Overview = () => {
  const { token } = useTokenDetail();
  return (
    <WrapperOverview>
      <div className="item description">
        <div className="title">Description</div>
        <Description className="desc">{token.description}</Description>
      </div>
      {/* <div className="item bids">
        <div className="title mb20">Bids</div>
        <div className="history">No bids yet. Be the first to place a bid!</div>
      </div> */}

      <div className="details">
        <div className="item">
          <div className="title mb20">Details</div>
        </div>
        <div className="detail">
          <div className="chain">
            <span className="icon"></span>
            <span className="text">CROSSCHAIN (ERC-721)</span>
          </div>
          <div className="original">
            <FaRegEye />
            <span className="text">View original</span>
          </div>
        </div>
      </div>
    </WrapperOverview>
  );
};

export default Overview;
