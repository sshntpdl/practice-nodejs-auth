import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../helpers/cloudinaryHelper.js";
import Image from "../models/Image.js";
import fs from "fs";

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //store the image url & public id along with the user in database
    const newImage = await Image.create({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    //delete the image file from the server
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    console.error("Error uploading image", error);
    res.status(500).json({ success: false, message: "Error uploading image" });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments({});
    const totalPages = Math.ceil(totalImages / limit);

    const sortObject = {};
    sortObject[sortBy] = sortOrder;

    const images = await Image.find({})
      .sort(sortObject)
      .skip(skip)
      .limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        message: "Images fetched successfully",
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.error("Error fetching image", error);
    res.status(500).json({ success: false, message: "Error fetching image" });
  }
};

//image delete functionality
const deleteImageController = async (req, res) => {
  try {
    const getCurrentImageId = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentImageId);

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }
    //check if the current user is the one who uploaded the image
    if (image.uploadedBy.toString() !== userId) {
      res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this image" });
    }
    //delete the image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    //delete the image from the database
    await Image.findByIdAndDelete(getCurrentImageId);
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image", error);
    res.status(500).json({ success: false, message: "Error deleting image" });
  }
};

export { uploadImageController, fetchImagesController, deleteImageController };
