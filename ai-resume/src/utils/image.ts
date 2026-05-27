export const getFullImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  if (imageUrl.startsWith("data:")) return imageUrl;
  return import.meta.env.VITE_DEFAULT_AVATAR + imageUrl;
};
