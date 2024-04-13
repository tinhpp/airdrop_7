import { useEffect, useState } from 'react';

export const usePlayer = (videoElement, initialState) => {
  const [playing, setPlaying] = useState(initialState.type ? initialState.type === 'video' : initialState.isPlaying);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(initialState.isMuted);
  const [autoPlayError, setAutoPlayError] = useState(false);

  useEffect(() => {
    if (playing) {
      const promise = videoElement.current?.play();
      if (promise !== undefined) {
        promise.then(() => setAutoPlayError(false)).catch(() => setAutoPlayError(true));
      }
    } else videoElement.current?.pause();
  }, [playing, videoElement]);

  const togglePlay = (e) => {
    e.stopPropagation();
    setPlaying((prev) => !prev);
  };

  const setPlayState = (playState) => {
    setPlaying(playState);
  };

  const handleOnTimeUpdate = () => {
    const _progress = (videoElement.current.currentTime / videoElement.current.duration) * 100;
    setProgress(_progress);
  };

  const handleVideoProgress = (e) => {
    const manualChange = Number(e.target.value);
    videoElement.current.currentTime = (videoElement.current.duration / 100) * manualChange;
    setProgress(manualChange);
  };

  const handleVideoSpeed = (e) => {
    const speed = Number(e.target.value);
    videoElement.current.playbackRate = speed;
    setSpeed(speed);
  };

  useEffect(() => {
    if (videoElement.current) {
      if (muted) videoElement.current.muted = true;
      else videoElement.current.muted = false;
    }
  }, [muted, videoElement]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted((prev) => !prev);
  };

  const setMutedState = (value) => setMuted(value);

  return {
    playerState: {
      isPlaying: playing,
      isMuted: muted,
      progress,
      speed,
    },
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    setPlayState,
    setMutedState,
    autoPlayError,
  };
};

export default usePlayer;
