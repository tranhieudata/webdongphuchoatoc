// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password : { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Mã hóa mật khẩu trước khi lưu vào database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức kiểm tra mật khẩu (hỗ trợ cả plain text và bcrypt)
UserSchema.methods.matchPassword = async function (password) {
  // Nếu password trong DB bắt đầu bằng $2 thì là bcrypt hash
  if (this.password.startsWith('$2')) {
    return await bcrypt.compare(password, this.password);
  }
  // Fallback: so sánh plain text (cho tài khoản tạo trước khi bật hash)
  return this.password === password;
};

const User = mongoose.model('User', UserSchema);

export {User}
