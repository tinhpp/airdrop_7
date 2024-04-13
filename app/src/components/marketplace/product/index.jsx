// import styles from './styles.module.scss';
import { useHover } from '@src/hooks';
import { addToCart, removeFromCart, selectIsItemInCart } from '@src/redux/features/cartSlice';
import { Button, Card, Typography } from 'antd';
import { useRef } from 'react';
import { FaPlus, FaX } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ProductMeta, WrapperBtns, WrapperCover } from './styled';
import useBuySale from '../useBuySale';
import { useQueryClient } from '@tanstack/react-query';
const { Meta } = Card;

// const onChange = (key) => {
//   console.log(key);
// };

export default function Product({ nftInfo }) {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  const ref = useRef(null);
  const onHover = useHover(ref);
  const isInCart = useSelector((state) => selectIsItemInCart(state, nftInfo));

  const { onBuy, isLoading } = useBuySale(nftInfo, () => qc.invalidateQueries(['listMarketplaceItems']));

  return (
    <Link to={`/token/${nftInfo.hash}`}>
      <ProductMeta
        ref={ref}
        style={{ width: '100%', background: '#362848', color: '#d9d9dd' }}
        cover={
          <WrapperCover onClick={(e) => e.stopPropagation()}>
            <img alt="example" src={nftInfo.image} />
            <WrapperBtns $show={onHover} onClick={(e) => e.stopPropagation()}>
              <Button
                loading={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBuy();
                }}
              >
                Buy now
              </Button>

              {isInCart ? (
                <Button
                  className="addToCart"
                  icon={<FaX />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(removeFromCart(nftInfo.hash));
                  }}
                />
              ) : (
                <Button
                  className="addToCart"
                  icon={<FaPlus />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(addToCart(nftInfo));
                  }}
                />
              )}
            </WrapperBtns>
          </WrapperCover>
        }
      >
        <Meta
          title={nftInfo.name}
          description={
            <Typography.Paragraph className="token-desc" ellipsis={{ rows: 3 }}>
              {nftInfo.description}
            </Typography.Paragraph>
          }
        />
        <div className="meta">
          <div className="meta-item">
            <span className="key">Price</span>
            <span className="value">{nftInfo.price} XCR</span>
          </div>
          <div className="meta-item">
            <span className="key">Highest bid</span>
            <span className="value">No bids yet</span>
          </div>
        </div>
      </ProductMeta>
    </Link>
  );
}
