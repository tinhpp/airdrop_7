import { FaPause, FaPlay } from 'react-icons/fa6';
import { Button } from 'antd';
// import { MediaIcon } from 'assets/Icon';
import clsx from 'clsx';
import { usePlayer } from '@src/hooks';
// import { useCurrentMedia } from 'provider/CurrentMediaProvider';
import { forwardRef, useRef, useState } from 'react';
import styled from 'styled-components';
import { mergeRefs } from '@src/utils';

const AudioPlayer =
  forwardRef <
  HTMLAudioElement >
  (({ src, className, isMuted = false, ...props }, ref) => {
    const audioRef = useRef < HTMLAudioElement > null;
    const { playerState, togglePlay } = usePlayer(audioRef, { isPlaying: false, isMuted });
    const [loaded, setLoaded] = useState(false);

    //   const { onPlay, onPause } = useCurrentMedia();

    //   const onPlayMedia = () => onPlay({ mediaRef: ref, callback: setPlayState });

    //   const onStopMedia = () => onPause({ mediaRef: ref, callback: setPlayState });
    return (
      <StyledPlayer className={clsx('player', className)} {...props}>
        {/* <MediaIcon className={clsx('placeholder')} /> */}
        <audio
          ref={mergeRefs([audioRef, ref])}
          muted={playerState.isMuted}
          controlsList="nodownload"
          loop
          src={src}
          className={clsx('asset', 'hide')}
          onLoadedData={() => setLoaded(true)}
        />
        {loaded ? (
          <Button
            shape="circle"
            // @ts-ignore
            icon={playerState.isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlay}
            className="action"
          />
        ) : null}
      </StyledPlayer>
    );
  });

const StyledPlayer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .placeholder {
    object-fit: contain;
    border-radius: 10px;
    width: 100%;
    height: 100% !important;

    object-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: #f6f6f6;
  }

  :hover .action {
    opacity: 100;
  }

  .action {
    opacity: 0;
    z-index: 99;
    position: absolute;
    bottom: 8px;
    right: 8px;
    /* transform: translate(-50%, -50%); */
    &__icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

export default AudioPlayer;
