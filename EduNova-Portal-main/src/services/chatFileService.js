// EduNova Chat File Upload & Attachment Service

// In-Memory Attachment Cache to prevent LocalStorage QuotaExceededError
const attachmentCache = new Map();

export const uploadChatFile = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));

    // Validate size (e.g., 50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return reject(new Error('File size exceeds maximum limit of 50MB'));
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 34;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isPdf = file.type === 'application/pdf';

        let fileType = 'document';
        if (isImage) fileType = 'image';
        else if (isVideo) fileType = 'video';
        else if (isPdf) fileType = 'pdf';

        // Create a fast Blob URL (Lightweight & Quota-Safe)
        const objectUrl = URL.createObjectURL(file);
        const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        // Also create compressed Base64 preview for images if small, or reuse objectUrl
        const attachmentObj = {
          id: attachmentId,
          name: file.name,
          type: fileType,
          mimeType: file.type,
          size: formatFileSize(file.size),
          rawSize: file.size,
          url: objectUrl,
          thumbnailUrl: isImage ? objectUrl : null,
          uploadedAt: new Date().toISOString()
        };

        // Cache in memory
        attachmentCache.set(attachmentId, attachmentObj);

        resolve(attachmentObj);
      }
    }, 100);
  });
};

export const getCachedAttachment = (attachmentId) => {
  return attachmentCache.get(attachmentId);
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
