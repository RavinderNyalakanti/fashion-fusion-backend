const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    id: { type: Number, unique: true },  // Explicitly define id as a unique field
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    user: { type: String, required: true },
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

