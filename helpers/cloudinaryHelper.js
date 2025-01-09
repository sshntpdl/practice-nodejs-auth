import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log("result", result);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to cloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export default uploadToCloudinary;
