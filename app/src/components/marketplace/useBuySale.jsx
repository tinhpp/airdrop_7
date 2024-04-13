import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, selectIsItemInCart } from '@src/redux/features/cartSlice';
import { ethers, utils } from 'ethers';
import { purchaseItem } from '@src/api/nfts.api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { marketPlaceContract } from '@src/utils/contracts/marketplace';

export const useBuySale = (token, reloadToken = () => { }) => {
  const dispatch = useDispatch();
  const isInCart = useSelector((state) => selectIsItemInCart(state, token));

  const buySale = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const account = (await provider.listAccounts())[0];
      const signer = provider.getSigner(account);

      const marketPlace = marketPlaceContract(signer);

      await (await marketPlace.purchaseItems([token.itemId], { value: utils.parseEther(token.price) })).wait();
      await purchaseItem(token.hash);
    } catch (error) {
      throw error;
    }
  };

  const { mutate, isLoading } = useMutation(buySale, {
    onSuccess: () => {
      reloadToken();
      isInCart && dispatch(removeFromCart(token.hash));
      toast.success('Purchase NFT successfully');
    },
    onError: (error) => {
      console.log('error', error);
      toast.error('Purchase NFT error');
    },
  });

  return { onBuy: mutate, isLoading };
};

export default useBuySale;
