const Order = require('../models/Order');

exports.getMyOrders = async (req, res) => {
  try {
    // req.user._id lấy từ Token sau khi check Auth
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};