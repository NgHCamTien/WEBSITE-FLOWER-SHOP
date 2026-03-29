const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: "Email đã tồn tại!" });

    user = new User({ name, email, password });
    // Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    res.status(201).json({ success: true, message: "Tạo tài khoản thành công! 🌸" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};