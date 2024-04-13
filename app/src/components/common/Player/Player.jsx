import AudioPlayer from '@src/components/common/Player/AudioPlayer';
import VideoPlayer from '@src/components/common/Player/VideoPlayer';
import { forwardRef } from 'react';

import Image from '@src/components/common/Player/Image';
import { useFetchMediaType, useResolvedMediaType } from '@src/hooks/fetch';

export const Player = forwardRef(
  ({ src, poster, alt, width = '100%', height = '100%', style, alignAction, ...restProps }, ref) => {
    const mergedStyle = {
      width,
      height,
      ...style,
    };

    const { url, type, isGif } = useFetchMediaType(['mediaTypes', src], src ?? undefined);
    const possiblePosterSrc = useResolvedMediaType(poster ?? undefined);

    switch (type) {
      case 'video': {
        return (
          <VideoPlayer
            src={url}
            style={mergedStyle}
            alignAction={alignAction}
            autoPlay={restProps.additionalProps?.autoPlay ?? false}
            isMuted={restProps.additionalProps?.muted ?? false}
            {...restProps}
          />
        );
      }
      case 'audio': {
        return <AudioPlayer src={url} style={mergedStyle} poster={possiblePosterSrc.url} {...restProps} ref={ref} />;
      }
      case 'image': {
        return <Image preview={false} alt={alt} src={url} style={mergedStyle} isGif={isGif} {...restProps} />;
      }
      default: {
        return <Image preview={false} alt={alt} src={url} style={mergedStyle} {...restProps} />;
      }
    }
  }
);

Player.displayName = 'Player';

export default Player;
