import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html"; // làm sạch html tránh các tấn công Cross-Site Scripting (XSS)
import { News } from "../../models/news.js";
import { User } from "../../models/user.js";

const NewsModel = mongoose.model("News",News)
const UserModel = mongoose.model("User",User)
class NewsController {
    // Tạo mới một bài viết
    async createNews(req, res) {
      try {
        const { title, author, content } = req.body;
        // làm sạch html conntent từ React-Quill
        const cleanContent = sanitizeHtml(content)
        // Kiểm tra xem author có tồn tại trong hệ thống không
        const user = await UserModel.findById(author);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Tạo một bài viết mới
        const newNews = new NewsModel({
          title,
          author,
          cleanContent,
        });
  
        await newNews.save();
  
        return res.status(201).json({
          message: 'News article created successfully',
          news: newNews,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    }
  
    // Lấy tất cả các bài viết
    async getAllNews(req, res) {
      // Lấy số trang và số bài viết mỗi trang từ query
      const page = parseInt(req.query.page) || 1; // Mặc định là trang 1 nếu không có
      const limit = 10; // Mặc định là 10 bài viết mỗi trang nếu không có
      // const response = await axios.get(`/api/news?page=${page}`);

      // Tính số bài viết cần bỏ qua (skip)
      const skip = (page - 1) * limit;

      // Lấy tất cả bài viết với skip và limit
      const news = await NewsModel.find()
        .skip(skip) // Bỏ qua số lượng bài viết tương ứng
        .limit(limit) // Lấy số bài viết cho mỗi trang
        .sort({ created_at: -1 }); // Sắp xếp bài viết theo thứ tự giảm dần của `created_at`

      // Đếm tổng số bài viết trong database để tính tổng số trang
      const totalNews = await NewsModel.countDocuments();

      // Tính tổng số trang
      const totalPages = Math.ceil(totalNews / limit);

      // Trả về dữ liệu bao gồm bài viết và thông tin phân trang
      return res.status(200).json({
        news,
        totalNews,
        totalPages,
        currentPage: page,
        limit,
      });
    }
  
    // Lấy một bài viết theo ID
    async getNewsById(req, res) {
      try {
        const news = await NewsModel.findById(req.params.id).populate('author', 'name');
  
        if (!news) {
          return res.status(404).json({ message: 'News article not found' });
        }
  
        return res.status(200).json({ news });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    }
  
    // Cập nhật một bài viết
    async updateNews(req, res) {
      try {

        const news = await NewsModel.findByIdAndUpdate(
            req.params.id,
            req.body
            ).populate('author', 'name');
  
        if (!news) {
          return res.status(404).json({ message: 'News article not found' });
        }
  
        return res.status(200).json({
          message: 'News article updated successfully',
          news,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    }
  
    // Xóa một bài viết
    async deleteNews(req, res) {
      try {
        const news = await NewsModel.findByIdAndDelete(req.params.id);
  
        if (!news) {
          return res.status(404).json({ message: 'News article not found' });
        }
        return res.status(200).json({
          message: 'News article deleted successfully',
          news,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    }
  }
  
  export {NewsController}