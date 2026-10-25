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

/**
 * Helper to get the most accurate product image URL,
 * falling back gracefully based on the variety/category.
 */
export const getProductImage = (product) => {
  if (!product) return '/images/rice-default.jpg';

  const rawUrl = product.photoUrl || product.imageUrl;
  if (rawUrl) {
    return getImageUrl(rawUrl);
  }

  const term = `${product.variety || ''} ${product.category || ''} ${product.name || ''} ${product.slug || ''} ${product.id || ''}`.toLowerCase();

  if (term.includes('husk')) {
    return '/images/Pure Rice Husk.jpg';
  }
  if (term.includes('broken') || term.includes('kanki') || term.includes('khanda')) {
    return '/images/Broken-Rice.jpg';
  }
  if (term.includes('indrayani')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';
  }
  if (term.includes('paddy') || term.includes('dhan')) {
    return 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80';
  }
  if (term.includes('bhat') || term.includes('usna') || term.includes('ukada')) {
    return 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80';
  }
  if (term.includes('kolam')) {
    return '/images/rice-default.jpg';
  }
  if (term.includes('basmati')) {
    return 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80';
  }

  return '/images/Milled White Rice.webp';
};
