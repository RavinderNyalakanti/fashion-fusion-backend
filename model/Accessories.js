const mongoose = require('mongoose');

const accessoriesSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    image: String,
    productTitle: String,
    productPricing: Number,
    productRating: Number,
    brand: String
});

const Accessories = mongoose.model('Accessories', accessoriesSchema);

module.exports = Accessories;
