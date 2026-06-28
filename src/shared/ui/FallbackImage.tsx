import { useEffect, useState, type ImgHTMLAttributes } from 'react';

type FallbackImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  fallbackSrc?: string;
  onResolvedSrcChange?: (src: string) => void;
};

export default function FallbackImage({
  src,
  fallbackSrc = '/200w.gif',
  onResolvedSrcChange,
  onError,
  ...imgProps
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  useEffect(() => {
    onResolvedSrcChange?.(currentSrc);
  }, [currentSrc, onResolvedSrcChange]);

  return (
    <img
      {...imgProps}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
}
