import { Gif } from '@src/components/common/Player/Gif';
import { ImageWrapper, StyledImage } from '@src/components/common/Player/styled';

export const Image = ({ src, isGif = false, ...props }) => {
  return (
    <ImageWrapper className="player">
      {isGif ? <Gif src={src} style={props.style} /> : <StyledImage preview={false} src={src} {...props} />}
    </ImageWrapper>
  );
};

export default Image;
