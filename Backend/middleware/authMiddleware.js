const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 1. Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

      // 2. Lấy Model User trực tiếp từ mongoose để tránh lỗi Schema
      const User = mongoose.model('User');
      
      // 3. Tìm user và gán vào req.user
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Người dùng không tồn tại!' });
      }

      next();
    } catch (error) {
      console.error("Lỗi xác thực Token:", error.message);
      return res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn!' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Bạn chưa gửi Token!' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Chỉ dành cho Admin!' });
  }
};

module.exports = { protect, admin };