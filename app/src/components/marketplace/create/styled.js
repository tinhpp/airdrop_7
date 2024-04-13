import { Badge } from 'antd';
import styled from 'styled-components';

export const StyledCreateToken = styled.div`
  margin: 0 auto;
  width: 100%;
  /* max-width: 815px; */

  display: flex;
  flex-direction: column;
  row-gap: 32px;

  margin-bottom: 32px;

  .head {
    display: flex;
    flex-direction: column;

    h2.title {
      font-size: 46px;
      font-weight: 700;
      margin: 0;
    }

    span.sub {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.6);

      margin-top: 8px;
    }
  }

  .form-create {
    display: flex;
    column-gap: 32px;

    .left {
      flex: 1;

      display: flex;
      flex-direction: column;
      row-gap: 32px;

      .ant-form-item {
        margin-bottom: 0;
      }

      .account-section {
        padding: 16px;
        text-align: left;
        width: 100%;
        color: rgb(255, 255, 255);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;

        display: flex;
        column-gap: 16px;
        align-items: center;

        .account {
          flex: 1;

          .address {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            max-width: 100%;
            font-size: 13px;
            line-height: 20px;
            font-weight: 700;
          }

          .chain {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            max-width: 100%;
            font-family: inherit;
            font-size: 13px;
            line-height: 20px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.6);
          }
        }

        .icon img {
          width: 40px;
          height: 40px;
          /* border-radius: 50%; */

          /* border: 1px solid rgba(255, 255, 255, 0.08); */
        }
      }
    }

    .right {
      flex-shrink: 0;
      flex-basis: 400px;
      position: sticky;
      top: 96px;
      height: fit-content;

      .preview {
        display: flex;
        flex-direction: column;

        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 24px;

        .player {
          max-width: 350px;
          max-height: 350px;

          margin-bottom: 24px;
        }

        .info {
          padding: 12px;
          -webkit-box-pack: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          margin-bottom: 24px;
          text-overflow: ellipsis;
        }

        .name {
          font-size: 15px;
          line-height: 22px;
          font-weight: 700;
        }

        .desc {
          font-size: 13px;
          line-height: 20px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);

          margin-bottom: 0;
        }
      }
    }
  }

  .inp {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid transparent;
    transition: all 0.15s ease-in-out 0s;
    min-height: 48px;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;

    input {
      background-color: transparent;
    }
  }

  .create-btn {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row;
    position: relative;
    white-space: nowrap;
    line-height: 48px;
    height: 48px;
    min-width: 192px;
    font-size: 14px;
    border-radius: 10px;
    padding: 8px 18px;
    font-weight: 700;
    font-family: inherit;
    transition: all 0.15s ease-in-out 0s;
    transform-origin: center center;
    user-select: none;

    margin-bottom: 20px;
  }

  .create-btn:not(:disabled) {
    border-color: rgb(255, 255, 255);
    color: rgb(25, 28, 31) !important;
    background: rgb(255, 255, 255) !important;

    cursor: pointer;

    span {
      color: rgb(25, 28, 31) !important;
    }
  }
`;

export const WrapperRibbon = styled(Badge.Ribbon)``;
