// import { useSelector } from 'react-redux';
import Player from '../common/Player';
import { StyledItem } from './styled';
// import { selectIsItemInCart } from '@src/redux/features/cartSlice';
import { Button } from 'antd';
import { useRef } from 'react';
import { useHover } from '@src/hooks';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '@src/redux/features/cartSlice';

const CartItem = ({ item }) => {
  const ref = useRef();
  //   const isInCart = useSelector((state) => selectIsItemInCart(state, item));

  const isHover = useHover(ref);
  const dispatch = useDispatch();

  return (
    <StyledItem ref={ref}>
      <div className="asset">
        <Player src={item.image} />
      </div>

      <div className="info">
        <div className="left">
          <span className="name">{item.name}</span>
          <span className="collection">{item.collectionName}</span>
        </div>
        {isHover ? (
          <Button className="remove" onClick={() => dispatch(removeFromCart(item.hash))}>
            Remove
          </Button>
        ) : (
          <div className="price">{item.price} XCR</div>
        )}
      </div>
    </StyledItem>
  );
};

export default CartItem;
