const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Lấy chuỗi kết nối từ file .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌸 MongoDB Local đã kết nối thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1); // Dừng server nếu lỗi
  }
};

module.exports = connectDB;