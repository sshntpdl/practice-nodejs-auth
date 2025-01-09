import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";

import connectToDB from "./database/db.js";

import authRoutes from "./routes/auth-route.js";
import homeRoutes from "./routes/home-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import uploadImageRoutes from "./routes/image-routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectToDB();

// Middleware
app.use(json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
