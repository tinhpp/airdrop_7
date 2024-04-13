import { Link } from 'react-router-dom';
import styled from 'styled-components';

const WrapperLink = styled(Link)`
  display: flex;
  align-items: center;
  column-gap: 4px;
  svg {
    width: 16px;
    height: 16px;
    color: rgb(155, 117, 242);
  }
  .text {
    font-size: 15px;
    line-height: 16px;
    font-weight: 700;
  }
`;

export const CreateLink = () => {
  return (
    <WrapperLink to={'/marketplace/create'}>
      <svg viewBox="0 0 16 16" fill="none" width="24" height="24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 8C14 11.2875 11.2817 14 8 14C4.7183 14 2 11.2875 2 8C2 4.7183 4.71249 2 7.99419 2C11.2817 2 14 4.7183 14 8ZM8 4.5C8.27614 4.5 8.5 4.72386 8.5 5V7.5H11C11.2761 7.5 11.5 7.72386 11.5 8C11.5 8.27614 11.2761 8.5 11 8.5H8.5V11C8.5 11.2761 8.27614 11.5 8 11.5C7.72386 11.5 7.5 11.2761 7.5 11V8.5H5C4.72386 8.5 4.5 8.27614 4.5 8C4.5 7.72386 4.72386 7.5 5 7.5H7.5V5C7.5 4.72386 7.72386 4.5 8 4.5Z"
          fill="currentColor"
        />
      </svg>
      <span className="text">Create</span>
    </WrapperLink>
  );
};

export default CreateLink;
