const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    manufacturingDate: { type: Date, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);