import { ERC721_ABI } from '@src/abi';
import Player from '@src/components/common/Player';
import { resolveIpfsUri } from '@src/hooks';
import { compareString } from '@src/utils';
import { useQuery } from '@tanstack/react-query';
import { Button, Form, Input, Spin, Typography } from 'antd';
import axios from 'axios';
import { Contract, providers } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

const Preview = ({ loading }) => {
  const form = Form.useFormInstance();
  const address = Form.useWatch('address', form);
  const tokenId = Form.useWatch('tokenId', form);

  const provider = useMemo(() => new providers.Web3Provider(window.ethereum, 'any'), []);
  const account = useSelector((state) => state.account.address);

  const { data: token, isLoading } = useQuery(
    ['tokenInfo', { address, tokenId, account }],
    async () => {
      const values = form.getFieldsValue();
      const contract = new Contract(values.address, ERC721_ABI, provider);

      const owner = await contract.ownerOf(values.tokenId);

      if (!compareString(owner, account)) {
        throw new Error("Your aren't the owner of this token!");
      }

      const _uri = await contract.tokenURI(values.tokenId);
      const uri = resolveIpfsUri(_uri);
      const { data: metadata } = await axios.get(uri);
      return { ...metadata, image: resolveIpfsUri(metadata.image) };
    },
    { enabled: !!address && !!tokenId }
  );

  useEffect(() => {
    if (token) {
      form.setFieldValue('metadata', JSON.stringify(token));
    }
  }, [token, form]);

  return (
    <Spin spinning={isLoading && !!address && !!tokenId}>
      <div className="preview">
        <Player src={token?.image ?? 'https://placehold.co/350x350'} />

        {token ? (
          <div className="info">
            <div className="name">{token?.name}</div>
            <Typography.Paragraph className="desc" ellipsis={{ rows: 2 }}>
              {token?.description}
            </Typography.Paragraph>
          </div>
        ) : null}

        <Form.Item name="price" rules={[{ required: true, message: 'Please input sale price' }]}>
          <Input disabled={!token} className="inp" placeholder="Price: e.g. 5" suffix="XCR" />
        </Form.Item>

        <Button disabled={!token} htmlType="submit" className="create-btn" loading={loading}>
          Create NFT
        </Button>
      </div>
    </Spin>
  );
};

export default Preview;
