import { InboxOutlined } from '@ant-design/icons';
import { Upload as AUpload } from 'antd';
import styled from 'styled-components';

const { Dragger: ADragger } = AUpload;

export const Dragger = styled(ADragger)`
  .ant-upload {
    background: transparent;
    padding: 12px 16px;
  }
`;

const Upload = ({ onChange }) => {
  const beforeUpload = (file) => {
    onChange?.(file);
    return false;
  };
  const props = {
    beforeUpload,
    showUploadList: false,
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
      </p>
    </Dragger>
  );
};

export default Upload;
