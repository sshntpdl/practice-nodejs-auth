import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import adminMiddleware from "../middleware/admin-middleware.js";
import uploadMiddleware from "../middleware/upload-middleware.js";
import {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
} from "../controllers/image-controller.js";

const router = express.Router();

//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

//get all image
router.get("/get", authMiddleware, fetchImagesController);

//delete image route
// 677f58accac67ab2b191a6d1
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteImageController
);

export default router;
