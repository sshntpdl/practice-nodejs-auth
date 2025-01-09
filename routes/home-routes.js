import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
  const { username, role, userId } = req.userInfo;
  res.json({
    message: "Welcome to our Home Page",
    user: { _id: userId, username, role },
  });
});

export default router;
