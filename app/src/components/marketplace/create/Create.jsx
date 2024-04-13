import cvcScanIcon from '@src/assets/cvcscan-icon.png';
import { formatAddress } from '@src/utils/address';
import { Col, Form, Image, Input, Row } from 'antd';
import { useSelector } from 'react-redux';
import Preview from './Preview';
import { StyledCreateToken, WrapperRibbon } from './styled';
import { useMutation } from '@tanstack/react-query';
import { createNft } from '@src/api/nfts.api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { ERC721Contract, marketPlaceContract } from '@src/utils';
import { MARKETPLACE_ADDRESS } from '@src/constants';

export const Create = () => {
  const [form] = Form.useForm();
  const account = useSelector((state) => state.account.address);
  const navigate = useNavigate();

  const onCreateNFT = async (values) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const account = (await provider.listAccounts())[0];
      const signer = provider.getSigner(account);

      const tokenContract = ERC721Contract(values.address, signer);

      const marketPlace = marketPlaceContract(signer);

      const isApproved = await tokenContract.isApprovedForAll(signer.getAddress(), MARKETPLACE_ADDRESS);

      if (!isApproved) {
        await (await tokenContract.setApprovalForAll(MARKETPLACE_ADDRESS, true)).wait();
      }
      const receipt = await (
        await marketPlace.makeItem(values.address, values.tokenId, ethers.utils.parseUnits(values.price))
      ).wait();

      let itemId;
      if (receipt && receipt.events) {
        const event = receipt.events.find((event) => event.event === 'Offered');
        itemId = event.args.itemId.toString();
      }
      await createNft({ ...values, itemId });
    } catch (error) {
      throw error;
    }
  };

  const { mutate, isLoading } = useMutation(onCreateNFT, {
    onSuccess: () => {
      toast.success('Create NFT sale successfully!');
      navigate('/marketplace');
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message ?? 'Create NFT sale error');
    },
  });

  const onFinish = (values) => mutate({ ...values, nft: values.address, creator: account });

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <StyledCreateToken>
        <div className="head">
          <h2 className="title">Create New NFT</h2>
          <span className="sub">Single edition on CVC</span>
        </div>

        <div className="form-create">
          <div className="left">
            <WrapperRibbon text="Connected" color="green">
              <div className="account-section">
                <div className="icon">
                  <Image preview={false} src={cvcScanIcon} />
                </div>
                <div className="account">
                  <div className="address">{formatAddress(account, 7, 7)}</div>
                  <div className="chain">CVC Testnet</div>
                </div>
              </div>
            </WrapperRibbon>

            <Row gutter={8}>
              <Col span={18}>
                <Form.Item
                  name="address"
                  label="Token address"
                  rules={[
                    {
                      required: true,
                      message: 'Please input token address',
                    },
                  ]}
                >
                  <Input className="inp" placeholder="e.g. 0x0000000000000000000000000000000000000000" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="tokenId"
                  label="Token ID"
                  rules={[
                    {
                      required: true,
                      message: 'Please input token id',
                    },
                  ]}
                >
                  <Input className="inp" type="number" placeholder="e.g. 1" />
                </Form.Item>
              </Col>
              <Form.Item name="metadata" style={{ display: 'none' }}>
                <Input />
              </Form.Item>
            </Row>
          </div>
          <div className="right">
            <Preview loading={isLoading} />
          </div>
        </div>
      </StyledCreateToken>
    </Form>
  );
};

export default Create;
