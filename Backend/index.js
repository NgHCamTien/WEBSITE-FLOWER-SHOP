const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Thay bằng link của bạn nếu có file .env)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/Flower_Shop";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch(err => console.log("❌ Lỗi kết nối:", err));

app.get('/', (req, res) => {
  res.send("Server Flower Shop đang chạy...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});