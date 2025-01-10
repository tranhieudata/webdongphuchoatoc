// controllers/AdminController.js

import {Banner} from "../../models/Banner.js"

import { User } from "../../models/user.js";
import { News } from "../../models/news.js";
class AdminController {
  // Cập nhật Banner
  async updateBanner(req, res) {
    try {
      const { bannerText, bannerImageUrl } = req.body; // Ví dụ banner có text và ảnh URL

      // Cập nhật banner
      const banner = await Banner.findOne(); // Giả sử chỉ có một banner
      banner.text = bannerText || banner.text;
      banner.imageUrl = bannerImageUrl || banner.imageUrl;
      await banner.save();

      return res.status(200).json({ message: "Banner updated successfully", banner });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Thêm bài viết mới
  async createNews(req, res) {
    try {
      const { title, description, authorId } = req.body;

      const newNews = new News({
        title,
        description,
        author: authorId,
      });

      await newNews.save();
      return res.status(201).json({ message: "News article created successfully", news: newNews });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Xóa bài viết
  async deleteNews(req, res) {
    try {
      const { id } = req.params;

      await News.findByIdAndDelete(id);
      return res.status(200).json({ message: "News article deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Lấy tất cả người dùng
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Cập nhật thông tin người dùng (ví dụ thay đổi vai trò)
  async updateUser(req, res) {
    try {
      const { userId, role } = req.body;  // Thay đổi quyền của người dùng

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role || user.role;
      await user.save();

      return res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  async updateUserRole(req, res) {
    try {
      const { userId, role } = req.body;  // Nhận userId và role từ request

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role || user.role;
      await user.save();

      return res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export {AdminController}
