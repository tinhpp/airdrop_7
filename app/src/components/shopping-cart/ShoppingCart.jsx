import Cart from './Cart';
import { Icon } from '@iconify/react';
import { Dropdown as ADropdown, Badge, Button } from 'antd';
import styled from 'styled-components';
import { StyledEmpty } from './styled';
import { useSelector } from 'react-redux';

const Dropdown = styled.div`
  display: flex;
  min-width: 330px;
  min-height: 450px;

  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 48px 16px;
  margin: 12px 16px;
  border-radius: 16px;
  overflow: hidden;
  background: #191c1f;
`;

export const EmptyCart = () => {
  return (
    <StyledEmpty>
      <div className="title">So much space for NFTs</div>
      <div className="sub">Add NFTs to your bag to check out and get hold of them.</div>

      <Button>Explore the marketplace</Button>
    </StyledEmpty>
  );
};

export const ShoppingCart = () => {
  const quantity = useSelector((state) => state.cart.items.length);

  return (
    <ADropdown
      trigger={['click']}
      placement="bottom"
      getPopupContainer={(node) => node.parentNode}
      dropdownRender={() => <Dropdown>{quantity > 0 ? <Cart /> : <EmptyCart />}</Dropdown>}
    >
      <Badge count={quantity}>
        <Icon icon="mdi:shopping-outline" fontSize={24} cursor="pointer" />
      </Badge>
    </ADropdown>
  );
};

export default ShoppingCart;
