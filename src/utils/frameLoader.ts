export const preloadImages = (
  imageUrls: string[],
  onProgress: (progress: number) => void
): Promise<HTMLImageElement[]> => {
  return new Promise((resolve) => {
    if (imageUrls.length === 0) {
      onProgress(100);
      resolve([]);
      return;
    }

    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(imageUrls.length);

    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;

      const handleLoad = () => {
        loadedCount++;
        images[index] = img; // maintain original sequence order
        onProgress((loadedCount / imageUrls.length) * 100);
        if (loadedCount === imageUrls.length) {
          resolve(images.filter((entry) => entry?.complete && entry.naturalWidth > 0));
        }
      };

      img.onload = handleLoad;
      img.onerror = () => {
        loadedCount++;
        onProgress((loadedCount / imageUrls.length) * 100);
        if (loadedCount === imageUrls.length) {
          resolve(images.filter((entry) => entry?.complete && entry.naturalWidth > 0));
        }
      };
    });
  });
};
