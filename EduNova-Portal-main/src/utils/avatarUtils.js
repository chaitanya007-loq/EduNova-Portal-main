/**
 * Dynamic Avatar Utility for EduNova
 * Ensures every user account has a unique, dynamically generated avatar
 * based on their name/username unless a custom photo is uploaded.
 */

export const DEFAULT_STATIC_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';

/**
 * Returns user's custom avatar or a dynamically generated avatar SVG based on seed/name.
 * @param {Object|string} userOrName User object or name/url string
 * @param {string} fallbackUsername Fallback username or name string
 * @returns {string} Avatar image URL
 */
export const getDynamicAvatar = (userOrName, fallbackUsername = '') => {
  if (userOrName && typeof userOrName === 'object') {
    const customAvatar = userOrName.avatar || userOrName.photoUrl || userOrName.picture;
    if (customAvatar && typeof customAvatar === 'string' && !customAvatar.includes('photo-1534528741775-53994a69daeb')) {
      return customAvatar;
    }
    const name = userOrName.name || userOrName.username || userOrName.studentUsername || userOrName.email || fallbackUsername || 'EduNova Learner';
    const seed = encodeURIComponent(name.trim());
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  }

  const nameStr = (typeof userOrName === 'string' && userOrName.trim()) ? userOrName.trim() : (fallbackUsername || 'EduNova Learner');

  // If it's a custom URL or base64 image (not the static unsplash legacy photo), use it directly
  if (nameStr.startsWith('http://') || nameStr.startsWith('https://') || nameStr.startsWith('data:image/')) {
    if (!nameStr.includes('photo-1534528741775-53994a69daeb')) {
      return nameStr;
    }
  }

  const seed = encodeURIComponent(nameStr);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};
