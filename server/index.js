const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Thay URL bằng link MongoDB Atlas của bạn)
const mongoURI = "mongodb://localhost:27017/Flower_Shop"; 
mongoose.connect(mongoURI)
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

app.get('/', (req, res) => {
    res.send("API Website Điện Hoa đang chạy...");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});