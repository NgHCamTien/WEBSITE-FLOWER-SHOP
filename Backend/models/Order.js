const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Sửa từ "Array" thành cấu trúc chi tiết dưới đây
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String } // <--- ĐÂY LÀ DÒNG QUAN TRỌNG ĐỂ LƯU ẢNH
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'Chờ xác nhận',
    enum: ['Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Đã hoàn thành', 'Đã hủy'] 
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, default: 'Tiền mặt' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);