import mongoose from "mongoose";
import { User } from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserModel = mongoose.model("User",User)
class UserController {
    async createUser(req, res) {
      try {
        const { username, password } = req.body;
  
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
  
        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        // Tạo mới người dùng
        const newUser = new UserModel({
          username,
          password: hashedPassword,
        });
  
        // Lưu người dùng vào database
        await newUser.save();
  
        return res.status(201).json({
          message: "User created successfully",
          user: {
            username: newUser.username,
            created_at: newUser.created_at,
          },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    }
  
    // Đăng nhập (Lấy token JWT)
    async login(req, res) {
      try {
        const { username, password } = req.body;
  
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await UserModel.findOne({ username });
        if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Password or username wrong" });
        }
  
        // Tạo JWT token
        const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" } // Token hết hạn trong 1 giờ
        );
  
        return res.status(200).json({
          message: "Login successful",
          token,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    }
  
    // Lấy thông tin người dùng (dùng token JWT để xác thực)
    async getUser(req, res) {
      try {
        const userId = req.user.userId; // Thông tin userId sẽ được lấy từ middleware xác thực JWT
        console.log(userId)
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        return res.status(200).json({
          username: user.username,
          created_at: user.created_at,
          updated_at: user.updated_at,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    }
  
    // Cập nhật thông tin người dùng
    async updateUser(req, res) {
      try {
        const { username, password } = req.body;
        const userId = req.user.userId; // Thông tin userId sẽ được lấy từ middleware xác thực JWT
  
        // Tìm và cập nhật người dùng
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Nếu mật khẩu mới được cung cấp, mã hóa mật khẩu
        let updatedPassword = user.password;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          updatedPassword = await bcrypt.hash(password, salt);
        }
  
        // Cập nhật thông tin người dùng
        user.username = username || user.username;
        user.password = updatedPassword;
        user.updated_at = Date.now();
  
        await user.save();
  
        return res.status(200).json({
          message: "User updated successfully",
          user: {
            username: user.username,
            updated_at: user.updated_at,
          },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    }
  }
  
  export {UserController};