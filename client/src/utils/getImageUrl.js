export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return '/images/rice-default.jpg';
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  if (photoUrl.startsWith('/uploads/') || photoUrl.startsWith('uploads/')) {
    const cleanPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
    return `http://localhost:5000${cleanPath}`;
  }
  return photoUrl;
};
