import styled from 'styled-components';

export const StyledEmpty = styled.div`
  flex: 1;
  width: 100%;

  background-blend-mode: lighten;
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: 100%;
  background-color: rgb(25, 28, 31);
  background-image: url(https://rarible.com/public/0241f16c31ad8b2f1842.webp);

  padding: 24px 16px;

  .title {
    max-width: 250px;
    font-size: 28px;
    line-height: 32px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .sub {
    color: rgba(255, 255, 255, 0.6);
    font-size: 15px;
    line-height: 22px;
    font-weight: 500;
    margin-bottom: 24px;
  }
`;

export const StyledCart = styled.div`
  flex: 1;

  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 16px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 22px;
      line-height: 28px;
      font-weight: 700;
    }

    .action {
      display: flex;
      align-items: center;
      column-gap: 8px;

      button.clear {
        all: unset;
        font-size: 13px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.15s ease-in-out 0s;

        cursor: pointer;

        &:hover {
          color: #fff;
        }
      }

      button.close {
        all: unset;

        height: 40px;
        width: 40px;
        align-items: center;
        justify-content: center;
        padding: 0px;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: row;
        position: relative;
        white-space: nowrap;
        line-height: 40px;
        border: 1px solid transparent;
        min-width: auto;
        font-size: 14px;
        border-radius: 12px;
        font-weight: 700;
        font-family: inherit;
        transition: all 0.15s ease-in-out 0s;
        transform-origin: center center;
        user-select: none;

        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.04);
        }
      }
    }
  }

  .list {
    margin-top: 16px;
    flex: 1;
  }

  button.bought {
    all: unset;

    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row;
    position: relative;
    white-space: nowrap;
    background: rgba(255, 255, 255, 0.04) !important;
    line-height: 48px;
    height: 48px;
    border: 1px solid transparent;
    min-width: 100%;
    font-size: 14px;
    border-radius: 12px;
    font-weight: 700;
    font-family: inherit;
    transition: all 0.15s ease-in-out 0s;
    transform-origin: center center;
    user-select: none;

    border-color: rgb(255, 255, 255);
    color: rgb(25, 28, 31);
    background: rgb(255, 255, 255);
  }
`;

export const StyledItem = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;

  margin-bottom: 8px;

  .asset {
    width: 56px;
    height: 56px;
  }

  .info {
    flex: 1;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      flex-direction: column;

      .name {
        font-size: 15px;
        line-height: 22px;
        font-weight: 500;
        color: rgb(255, 255, 255);
      }

      .collection {
        color: rgba(255, 255, 255, 0.6);
        font-family: inherit;
        font-size: 13px;
        line-height: 20px;
        font-weight: 500;
      }
    }

    .remove {
      all: unset;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 0 16px;
      cursor: pointer;
      transition: all 0.15s ease-in-out 0s;
      font-weight: 600;
    }
  }
`;
