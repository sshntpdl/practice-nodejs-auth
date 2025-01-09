import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/auth-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

//all our routes are related to authorization & authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);

export default router;
