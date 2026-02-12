export const getFullImageUrl = (imageUrl: string) => {
  return import.meta.env.VITE_DEFAULT_AVATAR + imageUrl;
};
