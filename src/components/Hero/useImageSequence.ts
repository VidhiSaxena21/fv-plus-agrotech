import { useState, useEffect, useMemo } from 'react';

export const useImageSequence = (imageUrls: string[]) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const urlsKey = useMemo(() => imageUrls.join('\0'), [imageUrls]);

  useEffect(() => {
    let isMounted = true;

    const loadSequence = async () => {
      if (!imageUrls || imageUrls.length === 0) {
        if (isMounted) {
          setProgress(100);
          setIsLoaded(true);
        }
        return;
      }

      setIsLoaded(false);
      setProgress(0);

      let loadedCount = 0;
      const loadedImages: HTMLImageElement[] = [];

      await Promise.all(
        imageUrls.map((url, i) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              loadedImages[i] = img;
              loadedCount++;
              if (isMounted) {
                setProgress(Math.round((loadedCount / imageUrls.length) * 100));
              }
              resolve();
            };
            img.onerror = () => {
              resolve();
            };
          });
        })
      );

      if (isMounted) {
        setImages(loadedImages.filter(Boolean));
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
