import { Badge as ABadge, Tabs } from 'antd';
import styled from 'styled-components';

export const WrapperTokenDetail = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 64px;

  .left-panel {
    flex: 1 1 auto;

    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .right-panel {
    position: sticky;
    top: 96px;

    height: fit-content;
    min-width: 370px;
    max-width: 450px;

    display: flex;
    flex-direction: column;

    .token {
      margin-bottom: 32px;
      padding: 0 28px;

      .tokenHeader {
        display: flex;
        flex-direction: column;

        margin-bottom: 32px;

        .collection {
          color: #fff;
          font-size: 16px;
          font-weight: 400;

          margin-bottom: 16px;
        }

        .tokenName {
          font-size: 26px;
          font-weight: 700;

          margin-bottom: 8px;
        }

        .royalty {
          color: rgba(255, 255, 255, 0.6);

          span.percent {
            padding: 0px 6px;
            margin-left: 8px;
            border-radius: 8px;
            background: rgb(254, 218, 3);
            color: rgb(25, 28, 31);
            font-size: 13px;
            line-height: 20px;
            font-weight: 500;
          }
        }
      }
      .owner {
        display: flex;
        align-items: center;
        column-gap: 16px;

        .ant-avatar {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        &Info {
          display: flex;
          flex-direction: column;

          .title {
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
            line-height: 20px;
            font-weight: 500;
          }

          .address {
            color: #fff;
            font-size: 15px;
            line-height: 22px;
            font-weight: 700;
          }
        }
      }
    }

    .sale {
      width: 100%;
      height: auto;

      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;

      padding: 22px 24px;

      display: flex;
      flex-direction: column;
      row-gap: 16px;

      button {
        box-shadow: unset;

        &:not(:hover) {
          border-color: transparent;
        }
      }

      .price {
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.04);
        padding: 16px;

        .title {
          line-height: 17px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-weight: 500;

          margin-bottom: 4px;
        }

        .value {
          line-height: 26px;
          margin-bottom: 2px;

          font-size: 18px;
          font-weight: 600;
        }

        .exchange {
          line-height: 17px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-weight: 500;
        }
      }

      .buy {
        display: flex;
        column-gap: 8px;

        button {
          height: 48px;
          flex: 1;
          background-color: #fff;
          span {
            color: rgb(25, 28, 31);
          }
          svg {
            fill: rgb(25, 28, 31);
          }
        }

        &-button {
          padding: 8px 18px;
        }

        .addToCart {
          max-width: 48px;
          flex: 1;
        }
      }

      .place-bid {
        height: 48px;
        background-color: rgba(255, 255, 255, 0.04);
      }
    }
  }

  @media screen and (max-width: 980px) {
    flex-direction: column;

    .detail {
      max-width: 100%;
    }
  }
`;

export const Badge = styled(ABadge)`
  .ant-badge-count {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
  }
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-ink-bar {
    background: #fff !important;
  }
  .ant-tabs-tab-active > .ant-tabs-tab-btn {
    color: #fff !important;
  }

  .ant-tabs-tab-btn {
    &,
    & > div {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .ant-tabs-tab-active .prop {
    .ant-badge-count {
      background: #fff;
      color: rgb(25, 28, 31);
    }
  }
`;

export const WrapperOverview = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 40px;

  .item {
    padding: 0 20px;

    .title {
      font-size: 22px;
      line-height: 28px;
      font-weight: 700;

      margin-bottom: 8px;
    }
  }

  .description {
    .desc {
      margin-bottom: 0;
    }
  }

  .bids {
    .title {
      margin-bottom: 20px;
    }
    .history {
      font-size: 15px;
      line-height: 22px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .details {
    .title {
      margin-bottom: 20px;
    }
    .detail {
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      row-gap: 22px;

      .original {
        display: flex;
        align-items: center;
        column-gap: 10px;
        color: rgba(255, 255, 255, 0.8);

        .svg {
          fill: rgba(255, 255, 255, 0.8);
        }

        .text {
          color: inherit;
          font-size: 15px;
          font-weight: 600;
        }
      }
    }
  }
`;
