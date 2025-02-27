const Order = require('../../models/order');

exports.updateOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error('Error updating order status:', error);
        next(error); // Forward error to the next middleware
    }
};

exports.getAllOrders = async (req, res, next) => {
    const { status } = req.query;
    try {
        let matchStage = {};
        if (status && status !== 'All') {
            matchStage.status = status;
        }

        const orders = await Order.aggregate([
            { $match: matchStage },
            // Lookup for variant details
            {
                $lookup: {
                    from: "variants",
                    localField: "variant",
                    foreignField: "_id",
                    as: "variantDetails"
                }
            },
            // Unwind the variant details
            { $unwind: "$variantDetails" },
            // Project to shape the final output
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    name: 1,
                    image: 1,
                    price: 1,
                    quantity: 1,
                    size: 1,
                    variant: {
                        _id: "$variantDetails._id",
                        images: "$variantDetails.images"
                    },
                    paymentMethod: 1,
                    status: 1,
                    orderDate: 1,
                    address: 1
                }
            },
            // Sort by orderDate descending (most recent first)
            { $sort: { orderDate: -1 } }
        ]);

        res.json({ orders });
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        next(error); // Forward error to the next middleware
    }
};