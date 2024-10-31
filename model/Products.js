const mongoose = require('mongoose');

const accessoriesSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    image: [{type:String}],
    productTitle: String,
    productPricing: Number,
    productRating: Number,
    brand: String,


});


module.exports = mongoose.model('Products', accessoriesSchema);

