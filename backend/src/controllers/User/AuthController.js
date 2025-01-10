// controllers/AuthController.js
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.js';

class AuthController {
  // Đăng nhập
  async login(req, res) {
    const { username, password } = req.body;

    try {
      // Tìm người dùng theo username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Kiểm tra mật khẩu
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Tạo token
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }  // Token hết hạn sau 1 giờ
      );

      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Đăng xuất (clear token trong frontend)
  logout(req, res) {
    res.status(200).json({ message: 'Logout successful' });
  }
}

export {AuthController}
