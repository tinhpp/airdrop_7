import { Icon } from '@iconify/react';
import { clearAllCart, selectTotalPrice } from '@src/redux/features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import { StyledCart } from './styled';
import { ethers, utils } from 'ethers';
import { marketPlaceContract } from '@src/utils';
import { purchaseItems } from '@src/api/nfts.api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from 'antd';

const Cart = () => {
  const dispatch = useDispatch();
  const totalPrice = useSelector(selectTotalPrice);
  const cartItems = useSelector((state) => state.cart.items);

  const buySales = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const account = (await provider.listAccounts())[0];
      const signer = provider.getSigner(account);

      const marketPlace = marketPlaceContract(signer);
      await (
        await marketPlace.purchaseItems(
          cartItems.map((item) => item.itemId),
          { value: utils.parseEther(totalPrice.toString()) }
        )
      ).wait();
      await purchaseItems(cartItems.map((item) => item.hash));
    } catch (error) {
      throw error;
    }
  };

  const { mutate, isLoading } = useMutation(buySales, {
    onSuccess: () => {
      toast.success('Purchase NFT successfully');
      dispatch(clearAllCart());
    },
    onError: (error) => {
      console.log('error', error);
      toast.error('Purchase NFT error');
    },
  });
  return (
    <StyledCart>
      <div className="header">
        <span className="title">Bag</span>

        <div className="action">
          <button className="clear" onClick={() => dispatch(clearAllCart())}>
            Clear all
          </button>
          <button className="close">
            <Icon icon="fa6-solid:arrow-right-to-bracket" />
          </button>
        </div>
      </div>
      <div className="list">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <Button className="bought" onClick={mutate} loading={isLoading}>
        Buy now for {totalPrice} ETH
      </Button>
    </StyledCart>
  );
};

export default Cart;
