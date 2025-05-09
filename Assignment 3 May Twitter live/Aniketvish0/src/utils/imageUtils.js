export const processImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        const aspectRatio = img.width / img.height;
        let width = 512;
        let height = 512;
        if (aspectRatio > 1) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }
        const x = (512 - width) / 2;
        const y = (512 - height) / 2;
        ctx.drawImage(img, x, y, width, height);
        canvas.toBlob((blob) => {
          const processedUrl = URL.createObjectURL(blob);
          resolve({
            src: processedUrl,
            blob: blob
          });
        }, 'image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}; 