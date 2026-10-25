export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return '/images/rice-default.jpg';
  
  // External cloud URLs (Cloudinary, Unsplash, etc.)
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }

  // Uploaded images path handling
  if (photoUrl.startsWith('/uploads/') || photoUrl.startsWith('uploads/')) {
    const cleanPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
    const apiUrl = import.meta.env.VITE_API_URL;
    
    // If production backend URL is configured
    if (apiUrl && !apiUrl.includes('localhost')) {
      const baseUrl = apiUrl.replace(/\/api\/?$/, '');
      return `${baseUrl}${cleanPath}`;
    }
    
    // Local dev fallback
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return `http://localhost:5000${cleanPath}`;
    }
    
    // Production fallback if local uploads are not hosted
    return '/images/rice-default.jpg';
  }

  return photoUrl;
};
