// middlewares/adminMiddleware.js
import jwt from 'jsonwebtoken';

const adminMiddleware = (req, res, next) => {
    // First, check for token
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token and extract user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: You don't have admin privileges" });
        }
        
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.', code: 'TOKEN_EXPIRED' });
        }
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export { adminMiddleware };
  