// controllers/orderController.js
const Order = require('../../models/order');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../../models/user');

const UserId = '678e69ab60f79e1c8daa2f71'; // Replace with dynamic session handling

exports.getAllOrders = async (req, res) => {
    try {
        const userId = new ObjectId(UserId);
        const user = await User.findOne({ _id: userId });
        const _id_ = user.userId;

        const orders = await Order.find({ userId: _id_ })
            .populate('variant')
            .sort({ orderDate: -1 });

        res.render('../views/pages/user/orders', {
            user: userId,
            orders: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server error');
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const userId = new ObjectId(UserId);
        const user = await User.findOne({ _id: userId });
        const _id_ = user.userId;

        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: _id_
        }).populate('variant');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Server error');
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const userId = new ObjectId(UserId);
        const user = await User.findOne({ _id: userId });
        const _id_ = user.userId;

        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: _id_
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'Delivered' || order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        order.status = 'Cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).send('Server error');
    }
};