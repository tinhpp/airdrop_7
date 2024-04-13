import { FaPause, FaPlay, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { Button } from 'antd';
import clsx from 'clsx';
import { useHover, usePlayer } from '@src/hooks';
import { forwardRef, useRef, useState } from 'react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import styled from 'styled-components';
import { mergeRefs } from '@src/utils';

const VideoPlayer = forwardRef(
  (
    {
      src,
      className,
      style,
      autoPlay = false,
      isMuted = false,
      additionalProps = {},
      trigger = 'click',
      alignAction = 'bottom-right',
      type,
    },
    ref
  ) => {
    const wrapperRef = useRef < HTMLDivElement > null;
    const videoRef = useRef < HTMLVideoElement > null;
    const { playerState, autoPlayError, togglePlay, setPlayState, setMutedState, toggleMute } = usePlayer(videoRef, {
      isPlaying: autoPlay,
      isMuted,
    });
    const [loaded, setLoaded] = useState(false);

    const onHover = () => {
      setPlayState(true);
      setMutedState(false);
    };

    const onNotHover = () => {
      setPlayState(false);
      setMutedState(true);
    };

    useHover(
      wrapperRef,
      loaded && trigger === 'hover' ? onHover : null,
      loaded && trigger === 'hover' ? onNotHover : null
    );

    return (
      <StyledPlayer
        ref={wrapperRef}
        style={style}
        className={clsx('player', className)}
        width={additionalProps.width}
        height={additionalProps.height}
        $alignAction={alignAction}
      >
        <LazyLoadComponent>
          <video
            ref={mergeRefs([videoRef, ref])}
            controlsList="nodownload"
            onLoadedData={() => setLoaded(true)}
            className={clsx('lazy', additionalProps.className)}
            loop
            playsInline
            preload="metadata"
            autoPlay={autoPlay}
            muted={playerState.isMuted}
            {...additionalProps}
          >
            <source src={`${src}#t=0.5`} type={type} />
          </video>

          <div className="action">
            <Button
              icon={playerState.isMuted ? <FaVolumeXmark /> : <FaVolumeHigh />}
              shape="circle"
              onClick={toggleMute}
            />
            {(loaded && trigger === 'click') || autoPlayError ? (
              <Button
                shape="circle"
                // @ts-ignore
                icon={playerState.isPlaying ? <FaPause /> : <FaPlay />}
                onClick={togglePlay}
              />
            ) : null}
          </div>
        </LazyLoadComponent>
      </StyledPlayer>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

const StyledPlayer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  video {
    width: ${({ width }) => (width ? `${width}` : '100%')};
    height: ${({ height }) => (height ? `${height}` : '100%')};
  }

  :hover .action {
    opacity: 100;
  }

  /* .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 8px;
  } */

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 8px;
    opacity: 0;
    z-index: 99;
    position: absolute;
    top: ${({ $alignAction }) =>
      $alignAction === 'center' ? '50%' : ['top-right', 'top-left'].includes($alignAction) ? '8px' : 'unset'};
    bottom: ${({ $alignAction }) => (['bottom-right', 'bottom-left'].includes($alignAction) ? '8px' : 'unset')};
    right: ${({ $alignAction }) => (['bottom-right', 'top-right'].includes($alignAction) ? '8px' : 'unset')};
    left: ${({ $alignAction }) =>
      $alignAction === 'center' ? '50%' : ['bottom-left', 'top-left'].includes($alignAction) ? '8px' : 'unset'};
    transform: ${({ $alignAction }) => ($alignAction === 'center' ? 'translate(-50%, -50%)' : 'none')};
    &__icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

export default VideoPlayer;
