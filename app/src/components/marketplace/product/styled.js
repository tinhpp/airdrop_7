import { Card } from 'antd';
import styled from 'styled-components';

export const ProductMeta = styled(Card)`
  background: #fff;
  width: 16em;
  border-radius: 0.6em;
  // margin: 1em;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 13px 27px -5px hsla(240, 30.1%, 28%, 0.25), 0 8px 16px -8px hsla(0, 0%, 0%, 0.3),
    0 -6px 16px -6px hsla(0, 0%, 0%, 0.03);
  // transition: all 200ms ease;
  transition: all 0.15s ease-in-out 0s;
  will-change: transform;
  -webkit-box-flex: 1;
  flex-grow: 1;
  height: 100%;
  padding: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  &:hover {
    transform: translateY(-3px);
    box-shadow: rgba(255, 255, 255, 0.08) 0px 0px 0px 2px inset;
  }

  img {
    width: 100%;
    object-fit: cover;
  }

  .ant-card-body {
    padding: 0;
    padding-top: 15px;

    .ant-card-meta {
      padding: 0 8px;

      &-title {
        margin: 0 !important;
      }

      &-description {
        min-height: 66px;
      }
      .token-desc {
        margin-bottom: 0;
      }
    }
  }

  .meta {
    margin-top: 12px;

    padding: 12px;
    height: 68px;
    -webkit-box-pack: center;
    justify-content: center;
    background: #221630;
    border-radius: 10px;
    display: flex;
    flex-direction: row;

    &-item {
      flex: 1;
      display: flex;
      flex-direction: column;

      & > span {
        flex: 1;
      }

      span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 100%;
        font-family: inherit;
        font-size: 13px;
        line-height: 20px;
        font-weight: 500;
      }

      span.key {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
`;

export const WrapperCover = styled.div`
  position: relative;
  img {
    border-radius: 8px !important;
  }
`;

export const WrapperBtns = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ $show }) => ($show ? 1 : 0)};

  display: flex;

  column-gap: 4px;

  button {
    background: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row;
    position: relative;
    white-space: nowrap;
    line-height: 40px;
    height: 40px;
    border: 1px solid transparent;
    min-width: auto;
    font-size: 14px;
    border-radius: 12px;
    padding: 6px 13.5px;
    font-weight: 700;
    font-family: inherit;
    transition: all 0.15s ease-in-out 0s;
    transform-origin: center center;
    user-select: none;

    &,
    span {
      color: rgb(25, 28, 31);
    }
    svg path {
      fill: rgb(25, 28, 31);
      stroke: rgb(25, 28, 31);
    }
  }

  .addToCart {
    width: 40px;
    flex: 1;
  }
`;
