// Models/Product.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number }, // Giá sau khi giảm
  description: { type: String },
  category: { type: String }, // 'Hoa sinh nhật', 'Hoa khai trương'...
  thumbnail: { type: String }, // Đường dẫn ảnh chính
  images: [String], // Mảng các ảnh chi tiết
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false }
});