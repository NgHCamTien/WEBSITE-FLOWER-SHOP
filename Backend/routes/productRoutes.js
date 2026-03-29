const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { addProduct, deleteProduct } = require('../controllers/productController');

// Khách hàng thì chỉ được XEM (không cần middleware)
router.get('/', getProducts);

// CHỈ ADMIN mới được THÊM hoặc XÓA (dùng protect và admin)
router.post('/', protect, admin, addProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;