const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String, // Hoa hồng, Hoa lan, Quà tặng...
    imageUrl: String,
    stock: Number
});

module.exports = mongoose.model('Flower', flowerSchema);