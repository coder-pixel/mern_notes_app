export const BASE_URL = "http://127.0.0.1:5000";

export const cloudinaryConfig = {
  cloudName: "dumaz1iqr",
  uploadPreset: "notezipperapp",
};

export const cloudinaryURL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload?upload_preset=${cloudinaryConfig.uploadPreset}`;
