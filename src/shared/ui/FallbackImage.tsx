import { useState, type ImgHTMLAttributes } from 'react';

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
  onLoad,
  ...imgProps
}: FallbackImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const effectiveSrc = failedSource === src ? fallbackSrc : src;

  return (
    <img
      {...imgProps}
      src={effectiveSrc}
      onLoad={(event) => {
        onResolvedSrcChange?.(event.currentTarget.currentSrc || effectiveSrc);
        onLoad?.(event);
      }}
      onError={(event) => {
        if (failedSource !== src) {
          setFailedSource(src);
          onResolvedSrcChange?.(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
}
