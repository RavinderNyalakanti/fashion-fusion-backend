const Order = require('../model/Order');
const Counter = require('../model/Counter');

const initializeCounter = async (id) => {
    const count = await Counter.findById(id);
    if (!count) {
        await Counter.create({ _id: id, seq: 0 });
    }
};

initializeCounter('orderId');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.query.user});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createOrder = async (req, res) => {
    try {
        const existingOrder = await Order.findOne({ user: req.body.user_id, productId: req.body.productId });
        if (existingOrder) {
            existingOrder.quantity += 1;
            const updatedOrder = await existingOrder.save();
            return res.json(updatedOrder);
        }

        // Increment and fetch the next sequence value
        const counter = await Counter.findByIdAndUpdate(
            'orderId',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }  // Ensure a document is created if it doesn't exist
        );

        const order = new Order({
            id: counter.seq,  // Assign the incremented id
            quantity: 1,
            user: req.body.user_id,
            productId: req.body.productId,
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ id: req.params.id }).populate('products').populate('user');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.deleteOrder = async (req, res) => {
//     try {
//         const order = await Order.findOneAndDelete({ id: req.params.id });
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }; 

exports.deleteOrder = async (req, res) => {
    try{
        const {productId,userId} = req.params;
        const order = await Order.findOneAndDelete({ productId: productId, user: userId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
