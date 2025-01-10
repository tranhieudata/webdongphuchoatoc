// routes/authRoutes.js
import express from 'express';
import { AuthController } from '../controllers/User/AuthController.js';
import { body, validationResult } from 'express-validator';

const AuthRoute = express.Router();
const authController = new AuthController()
// Route đăng nhập
AuthRoute.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Xử lý đăng nhập
    await authController.login;
  }
);

// Route đăng xuất
AuthRoute.post('/logout', authController.logout);

export {AuthRoute};
