import { formatAddress } from '@src/utils/address';
import { Avatar, Button } from 'antd';
import { Fragment } from 'react';
import { FaPlus, FaUser, FaX } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';

import { addToCart, removeFromCart, selectIsItemInCart } from '@src/redux/features/cartSlice';
import { ethers, utils } from 'ethers';
import { marketPlaceContract } from '@src/utils';
import { purchaseItem } from '@src/api/nfts.api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTokenDetail } from './useTokenDetail';

const Info = () => {
  const { token, reloadToken } = useTokenDetail();
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

  return (
    <Fragment>
      <div className="token">
        <div className="tokenHeader">
          {/* <div className="collection">{token.collectionName}</div> */}

          <div className="tokenName">{token.name}</div>
          {/* <div className="royalty">
            Royalties: <span className="percent">{0}%</span>
          </div> */}
        </div>

        <div className="owner">
          <Avatar shape="circle" className="avatar" icon={<FaUser />} />
          <div className="ownerInfo">
            <div className="title">Current owner</div>
            <div className="address">{formatAddress('0xfaB347c04669fC39a5376e9C27C070cd3D9c716b', 7, 4)}</div>
          </div>
        </div>
      </div>
      <div className="sale">
        <div className="price">
          <div className="title">Price</div>
          <div className="value">{token.price} XCR</div>
          {/* <div className="exchange">$434</div> */}
        </div>

        <div className="buy">
          <Button block disabled={token.status !== 0} className="buy-button" onClick={mutate} loading={isLoading}>
            {token.status === 0 ? `Buy now for ${token.price} XCR` : 'Sold'}
          </Button>
          {isInCart ? (
            <Button className="addToCart" icon={<FaX />} onClick={() => dispatch(removeFromCart(token.hash))} />
          ) : (
            <Button className="addToCart" icon={<FaPlus />} onClick={() => dispatch(addToCart(token))} />
          )}
        </div>

        {/* <Button block className="place-bid">
          Place a bid
        </Button> */}
      </div>
    </Fragment>
  );
};

export default Info;
