import { Image } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled from 'styled-components';

export const ImageWrapper = styled.div`
  width: auto;
  height: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  .ant-image {
    width: 50%;
    height: 50%;
    object-fit: contain;

    margin: 0 auto;

    img {
      border-radius: 14px;
    }
  }
`;

export const StyledImage = styled(Image)`
  width: 50%;
  height: 50%;
  object-fit: contain;
  border-radius: 14px;
`;

export const LazyImage = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: contain;
`;

export const GifPlayer = styled.div`
  display: inline-block;
  position: relative;
  user-select: none;
  width: ${({ width }) => `${width}px` ?? '100%'};
  height: ${({ height }) => `${height}px` ?? '100%'};
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  border-radius: 20px;
  width: 100%;
  height: 100%;

  canvas {
    width: 100%;
    height: 100%;
    aspect-ratio: 3/2;
    object-fit: contain;
    border-radius: 14px;
    mix-blend-mode: multiply;
  }

  cursor: pointer;

  .action {
    background-color: rgba(0, 0, 0, 0.5);
    border: 2px dashed #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgb(0 0 0 / 50%);
    color: #fff;
    cursor: pointer;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 24px;
    left: 50%;
    opacity: 1;
    padding: 14px 10px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    transition: transform 0.4s, opacity 0.4s;

    ::after {
      content: 'GIF';
    }

    :hover {
      background-color: rgba(0, 0, 0, 0.7);
      box-shadow: 0 0 0 3px rgb(0 0 0 / 70%);
    }
  }

  &.playing .action {
    transform: translate(-50%, -50%) scale(0) rotate(180deg);
    opacity: 0.5;
  }
`;
