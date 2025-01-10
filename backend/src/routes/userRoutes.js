// routes/userRoutes.js
import express from "express";
import { UserController } from "../controllers/User/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const UserRoute = express.Router();
const userController = new UserController()
// Route đăng ký người dùng mới
UserRoute.post("/register", userController.createUser);

// Route đăng nhập để lấy token
UserRoute.post("/login", userController.login);

// Route lấy thông tin người dùng (yêu cầu đăng nhập)
UserRoute.get("/me", authMiddleware, userController.getUser);

// Route cập nhật thông tin người dùng (yêu cầu đăng nhập)
UserRoute.put("/me", authMiddleware, userController.updateUser);

export {UserRoute};
