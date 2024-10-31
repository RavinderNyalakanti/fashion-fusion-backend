const Accessories = require('../model/Accessories');
const Counter = require('../model/Counter');

const initializeCounter = async (id) => {
    const count = await Counter.findById(id);
    if (!count) {
        await Counter.create({ _id: id, seq: 0 });
    }
};

initializeCounter('accessoryId');

exports.getAllAccessories = async (req, res) => {
    try {
        const accessories = await Accessories.find();
        res.json(accessories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAccessory = async (req, res) => {
    try {
        const ExistAccessories = await Accessories.findOne({ productTitle: req.body.productTitle });
        if (ExistAccessories) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        const counter = await Counter.findByIdAndUpdate(
            'accessoryId',
            { $inc: { seq: 1 } },
            { new: true }
        );

        const accessory = new Accessories({
            id: counter.seq,
            image: req.body.image,
            productTitle: req.body.productTitle,
            productPricing: req.body.productPricing,
            productRating: req.body.productRating,
            brand: req.body.brand
        });

        const newAccessory = await accessory.save();
        console.log('Created product:', newAccessory);
        res.status(201).json(newAccessory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAccessoryById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const accessory = await Accessories.findOne({ id });
        if (!accessory) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(accessory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAccessory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const accessory = await Accessories.findOneAndUpdate({ id }, req.body, { new: true });
        if (!accessory) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(accessory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAccessory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const accessory = await Accessories.findOneAndDelete({ id });
        if (!accessory) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
