import { uploadFileAPI } from "@/api/upload/upload";

/**
 * 上传图片
 */
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await uploadFileAPI(formData);
  return res.data.url;
};
