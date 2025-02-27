// controllers/checkoutController.js
const Variant = require('../../models/variant');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Coupon = require('../../models/coupon');
const Address = require('../../models/address');
const Order = require('../../models/order');
const User = require('../../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const session = new ObjectId('678e69ab60f79e1c8daa2f71'); // Replace with dynamic session handling

exports.getCheckoutPage = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: session });
        const coupons = await Coupon.find({
            status: 'Active',
            validity: { $gte: new Date() }
        });
        
        let discount = req.query.discount || 0;
        if (!cart) {
            return res.render('../views/pages/user/checkout', { 
                items: []  // Empty array if no items in the cart
            });
        }

        const cartItems = await Promise.all(cart.items.map(async (item) => {
            const variant = await Variant.findById(item.variantId);
            const product = await Product.findById(variant.productId);
            
            const inStock = variant.sizes[item.size] >= item.quantity;
            const availableStock = variant.sizes[item.size] || 0;
            
            return {
                variantId: item.variantId,
                productId: product._id,
                quantity: item.quantity,
                size: item.size,
                color: variant.color,
                images: variant.images,
                sizes: variant.sizes,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
            };
        }));

        res.render('../views/pages/user/checkout', { 
            items: cartItems,
            totalAmount: calculateTotal(cartItems),
            discount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching cart');
    }
};

function calculateTotal(items) {
    return items.reduce((total, item) => 
        total + (item.discountPrice || item.price) * item.quantity, 0
    );
}

exports.createAddress = async (req, res) => {
    try {
        const { street, city, state, postalCode, country } = req.body;
        const userId = session; // Replace with dynamic session handling

        const addressCount = await Address.countDocuments({ userId });
        const isPrimary = addressCount === 0;

        const address = await Address.create({
            userId,
            street,
            city,
            state,
            postalCode,
            country,
            isPrimary
        });

        res.status(201).json(address);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

exports.editAddress = async (req, res) => {
    try {
        const { street, city, state, postalCode, country } = req.body;
        const addressId = req.params.id;
        const userId = session; // Replace with dynamic session handling

        const address = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { street, city, state, postalCode, country },
            { new: true, runValidators: true }
        );

        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json(address);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.selectPrimaryAddress = async (req, res) => {
    try {
        const userId = session; // Replace with dynamic session handling
        const addressId = req.params.id;

        await Address.updateMany(
            { userId, isPrimary: true },
            { isPrimary: false }
        );

        const address = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { isPrimary: true },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json(address);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPrimaryAddress = async (req, res) => {
    try {
        const address = await Address.findOne({ userId: session, isPrimary: true });

        if (!address) {
            return res.status(404).json({ 
                error: 'No primary address selected. Please select a primary address.' 
            });
        }

        res.json(address);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: session }); // Replace with dynamic session handling

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

        res.json(addresses);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.placeOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingAddressId } = req.body;
        const userId = session; // Replace with dynamic session handling

        if (!['cod', 'credit', 'debit', 'upi'].includes(paymentMethod)) {
            return res.status(400).json({ error: 'Invalid payment method' });
        }

        const user = await User.findOne({ _id: userId });
        const _id_ = user.userId;

        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const shippingAddress = await Address.findById(shippingAddressId);
        if (!shippingAddress) {
            return res.status(400).json({ error: 'Invalid shipping address' });
        }

        // Check stock before processing orders
        for (const cartItem of cart.items) {
            const variant = await Variant.findById(cartItem.variantId);
            if (!variant) {
                return res.status(400).json({ error: `Variant not found: ${cartItem.variantId}` });
            }

            if (!variant.sizes[cartItem.size] || variant.sizes[cartItem.size] < cartItem.quantity) {
                return res.status(400).json({
                    stock: "out",
                    error: 'Some items in your cart are out of stock'
                });
            }
        }

        const orderPromises = cart.items.map(async (cartItem) => {
            const variant = await Variant.findById(cartItem.variantId);
            const product = await Product.findById(variant.productId);
            
            if (!product) {
                throw new Error(`Product not found for variant: ${cartItem.variantId}`);
            }

            const variantImage = variant.images?.[0] || product.image;
            const price = product.discountPrice || product.price;

            const order = await Order.create({
                userId: _id_,
                name: product.name,
                image: variantImage,
                price: price,
                quantity: cartItem.quantity,
                size: cartItem.size,
                variant: cartItem.variantId,
                paymentMethod: paymentMethod,
                status: 'Pending',
                address: {
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country
                }
            });

            // Update inventory
            await Variant.findByIdAndUpdate(
                cartItem.variantId,
                { $inc: { [`sizes.${cartItem.size}`]: -cartItem.quantity } }
            );

            return order;
        });

        const orders = await Promise.all(orderPromises);

        // Clear cart after successful order creation
        await Cart.findOneAndUpdate(
            { user: userId },
            { items: [] }
        );

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Orders placed successfully',
            orders: orders.map(order => order._id)
        });

    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(500).json({ 
            error: 'Order creation failed',
            message: error.message 
        });
    }
};