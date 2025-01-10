// middlewares/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    const { role } = req.user;  // `req.user` đã được gắn trong quá trình xác thực JWT
    
    if (role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: You don't have admin privileges" });
    }
  
    next();
  };
  
  export {adminMiddleware};
  