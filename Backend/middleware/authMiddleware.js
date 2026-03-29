const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Kiểm tra xem người dùng đã đăng nhập chưa (Có Token không?)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header (dạng: Bearer abcxyz...)
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ DB (không lấy password) và gán vào request
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để thực hiện thao tác này.' });
  }
};

// 2. Kiểm tra xem có phải là ADMIN không
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Đúng là admin thì cho đi tiếp
  } else {
    res.status(403).json({ success: false, message: 'Truy cập bị từ chối! Chỉ dành cho Admin.' });
  }
};

module.exports = { protect, admin };