export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images only.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Please upload images smaller than 10MB.'
    };
  }

  return { isValid: true };
};

export const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image - blob creation failed'));
              }
            },
            file.type,
            quality
          );
        } catch (drawError) {
          reject(new Error(`Failed to draw image on canvas: ${drawError}`));
        }
      };

      img.onerror = (event) => {
        reject(new Error('Failed to load image for compression'));
      };

      // Create object URL and clean it up
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      
      // Clean up object URL after image loads or fails
      img.onload = (originalOnLoad => function(this: HTMLImageElement, ev: Event) {
        URL.revokeObjectURL(objectUrl);
        return originalOnLoad?.call(this, ev);
      })(img.onload);
      
      img.onerror = (originalOnError => function(this: HTMLImageElement, ev: Event | string) {
        URL.revokeObjectURL(objectUrl);
        return originalOnError?.call(this, ev);
      })(img.onerror);

    } catch (error) {
      reject(new Error(`Image compression setup failed: ${error}`));
    }
  });
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file before processing
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file provided for base64 conversion'));
      return;
    }

    if (file.size === 0) {
      reject(new Error('File is empty'));
      return;
    }

    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            const base64Data = result.split(',')[1];
            if (base64Data) {
              resolve(base64Data);
            } else {
              reject(new Error('Failed to extract base64 data from file'));
            }
          } else {
            reject(new Error('FileReader result is not a string'));
          }
        } catch (processError) {
          reject(new Error(`Failed to process base64 conversion: ${processError}`));
        }
      };
      
      reader.onerror = (event) => {
        reject(new Error(`FileReader error: ${reader.error?.message || 'Unknown error'}`));
      };
      
      reader.onabort = () => {
        reject(new Error('File reading was aborted'));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(new Error(`Base64 conversion setup failed: ${error}`));
    }
  });
};
