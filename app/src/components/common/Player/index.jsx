import AudioPlayer from '@src/components/common/Player/AudioPlayer';
import { Gif } from '@src/components/common/Player/Gif';
import OSBPlayer from '@src/components/common/Player/Player';
import VideoPlayer from '@src/components/common/Player/VideoPlayer';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { StyledImage } from '@src/components/common/Player/styled';

const Player = OSBPlayer;

Player.Image = StyledImage;
Player.LazyImage = LazyLoadImage;
Player.GIF = Gif;
Player.Video = VideoPlayer;
Player.Audio = AudioPlayer;

export default Player;
