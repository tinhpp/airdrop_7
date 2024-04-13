import { Canvas, usePlayback, usePlayerState, useWorkerParser } from '@react-gifs/tools';
import clsx from 'clsx';
import { GifPlayer } from '@src/components/common/Player/styled';

export const Gif = ({ src, ...props }) => {
  // default state
  const [state, update] = usePlayerState({ playing: true });

  //  load and parse gif
  useWorkerParser(`${src}${src?.startsWith('blob') ? '' : '?not-from-cache-please'}`, update);

  // updates current index
  usePlayback(state, () => update(({ index }) => ({ index: index + 1 })));

  const toggleGif = (e) => {
    e.stopPropagation();
    update((props) => ({ ...props, playing: !props.playing }));
  };

  // render frames
  return (
    <GifPlayer onClick={toggleGif} className={clsx('gif_player', state.playing && 'playing')} {...props}>
      <Canvas {...state} />
      <div className="action" />
    </GifPlayer>
  );
};
