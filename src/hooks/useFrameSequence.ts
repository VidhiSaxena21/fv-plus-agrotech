import { useState, useEffect, useMemo } from 'react';
import { preloadImages } from '../utils/frameLoader';

export const useFrameSequence = (imageUrls: string[]) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const urlsKey = useMemo(() => imageUrls.join('\0'), [imageUrls]);

  useEffect(() => {
    let isMounted = true;

    const loadSequence = async () => {
      // If there are no URLs, mark as loaded instantly (e.g. before assets are placed)
      if (!imageUrls || imageUrls.length === 0) {
        if (isMounted) {
          setProgress(100);
          setIsLoaded(true);
        }
        return;
      }

      setIsLoaded(false);
      setProgress(0);

      const loadedImages = await preloadImages(imageUrls, (p) => {
        if (isMounted) setProgress(p);
      });

      if (isMounted) {
        setImages(loadedImages);
        setIsLoaded(true);
      }
    };

    loadSequence();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlsKey]);

  return { images, progress, isLoaded };
};
