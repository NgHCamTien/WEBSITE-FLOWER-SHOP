const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 0. CẤU HÌNH LƯU TRỮ (UPLOADS) ---
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- 1. KẾT NỐI DATABASE ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/website_flower')
    .then(() => console.log("🌸 Connected to DB"))
    .catch(err => console.log("❌ DB Error:", err));

// --- 2. ĐỊNH NGHĨA MODELS ---
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, stock: Number, category: String, description: String, thumbnail: [String], image: String 
}));

const User = mongoose.model('User', new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: { type: String, required: true },
    role: { type: String, default: 'customer' },
    addresses: [{ fullName: String, phone: String, city: String, detail: String, fullAddress: String }]
}, { collection: 'users' }));

const Category = mongoose.model('Category', new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, quantity: Number, image: String }],
    totalAmount: Number, status: { type: String, default: 'Chờ xác nhận' }, address: String, phone: String, paymentMethod: String, createdAt: { type: Date, default: Date.now }
}));

// --- 3. HỆ THỐNG API ---

// --- [API AUTHENTICATION] ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
            return res.json({ success: true, token, user: { _id: user._id, name: user.name, role: user.role } });
        }
        res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// --- [API SẢN PHẨM] ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy hoa!" });
        res.json({ success: true, product });
    } catch (error) { res.status(500).json({ success: false, error: "ID không hợp lệ" }); }
});

app.post('/api/products', upload.array('images', 4), async (req, res) => {
    try {
        const { name, price, stock, category, description } = req.body;
        const imageUrls = req.files.map(file => file.filename); 
        const newProduct = new Product({
            name, price: Number(price), stock: Number(stock), category, description,
            thumbnail: imageUrls, image: imageUrls[0]
        });
        await newProduct.save();
        res.status(201).json({ success: true, message: "Thêm hoa thành công! 🌸" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Đã xóa hoa!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// --- [API ĐƠN HÀNG - DÀNH CHO KHÁCH HÀNG] ---
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, order: savedOrder });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/orders/my-orders', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false, message: "Chưa đăng nhập!" });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const orders = await Order.find({ userId: decoded.id }).populate('items.productId').sort({ createdAt: -1 });
        res.json(orders); 
    } catch (error) { res.status(500).json({ success: false, error: "Lỗi xác thực" }); }
});

// --- [API NGƯỜI DÙNG & ĐỊA CHỈ] ---
app.post('/api/users/address', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false, message: "Thiếu Token!" });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const user = await User.findByIdAndUpdate(decoded.id, { $push: { addresses: req.body } }, { new: true });
        res.json({ success: true, message: "Lưu địa chỉ thành công!", addresses: user.addresses });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// --- [API ADMIN - QUẢN LÝ HỆ THỐNG] ---

// 1. Lấy toàn bộ đơn hàng (Tất cả khách hàng)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, orders }); 
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 2. Cập nhật trạng thái đơn hàng (Ví dụ: Chờ xác nhận -> Đã hoàn thành)
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ success: true, message: "Cập nhật thành công!", order: updatedOrder });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 3. Quản lý danh sách người dùng
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Đã xóa người dùng!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// --- [API DANH MỤC] ---
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ success: true, categories });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/categories', async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ success: true });
    } catch (error) { res.status(400).json({ success: false, error: "Trùng lặp hoặc lỗi dữ liệu!" }); }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));