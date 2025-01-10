// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

  const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header
 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Giải mã token và lấy thông tin người dùng
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Gán thông tin người dùng vào request
   
    next(); // Tiếp tục xử lý request
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export {authMiddleware}
