const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 0. CẤU HÌNH LƯU TRỮ ẢNH
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// 1. KẾT NỐI DATABASE
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/website_flower')
    .then(() => console.log("🌸 Connected to DB"))
    .catch(err => console.log("❌ DB Error:", err));

// 2. ĐỊNH NGHĨA TẤT CẢ MODELS
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
    category: String,
    description: String,
    thumbnail: [String] 
}));

const User = mongoose.model('User', new mongoose.Schema({
    name: String, 
    email: { type: String, unique: true }, 
    password: { type: String, required: true }, // THÊM DÒNG NÀY VÀO ĐÂY
    role: { type: String, default: 'customer' },
    addresses: [{
        fullName: String,
        phone: String,
        city: String,
        detail: String,
        fullAddress: String
    }]
}, { collection: 'users' }));
const Category = mongoose.model('Category', new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    status: { type: String, default: 'Chờ xác nhận' },
    address: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
}));

// ---------------------------------------------------
// 3. HỆ THỐNG API
// ---------------------------------------------------

// --- AUTH ---
// --- AUTH LOGIN (Bản cập nhật lấy User từ DB) ---
// --- AUTH LOGIN (Bản sửa lỗi 401 - Chấp nhận cả Admin và User DB) ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Tìm bất kỳ ai có email này trong bảng users của MongoDB
        const user = await User.findOne({ email });

        if (user && user.password === password) {
            return res.json({
                success: true,
                user: { 
                    _id: user._id, // Trả về ID thật từ DB
                    name: user.name, 
                    role: user.role 
                }
            });
        }
        res.status(401).json({ success: false, message: "Sai tài khoản!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = { $gte: Number(minPrice || 0), $lte: Number(maxPrice || 10000000) };
        }

        // --- LOGIC SẮP XẾP ---
        let sortQuery = { createdAt: -1 }; // Mặc định mới nhất
        if (sort === 'price-asc') sortQuery = { price: 1 };
        if (sort === 'price-desc') sortQuery = { price: -1 };

        const products = await Product.find(query).sort(sortQuery);
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Không thấy hoa!" });
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/products', upload.array('thumbnail', 4), async (req, res) => {
    try {
        const productData = req.body;
        if (req.files) productData.thumbnail = req.files.map(file => `/uploads/${file.filename}`);
        const product = new Product(productData);
        await product.save();
        res.status(201).json({ success: true, message: "Thêm thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Đã xóa hoa!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ success: true, message: "Thêm danh mục thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- ORDERS (ĐƠN HÀNG) ---
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- USERS ---
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// --- API LƯU ĐỊA CHỈ (Dán đoạn này nè Tiên) ---
app.post('/api/users/address', async (req, res) => {
    try {
        const { userId, fullName, phone, city, detail, fullAddress } = req.body;
        
        // Kiểm tra xem có gửi thiếu userId không
        if (!userId) return res.status(400).json({ success: false, message: "Thiếu ID người dùng!" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy User trong DB" });

        // Thêm địa chỉ mới vào mảng
        user.addresses.push({ fullName, phone, city, detail, fullAddress });
        await user.save();

        res.status(201).json({ success: true, message: "Đã lưu vào DB thành công!" });
    } catch (error) {
        console.error("Lỗi Backend:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get('/api/users/:userId/addresses', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        res.json(user.addresses || []); 
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.listen(5000, () => console.log("🚀 Server running on port 5000"));