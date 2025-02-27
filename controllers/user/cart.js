// controllers/cartController.js
const Variant = require('../../models/variant');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Coupon = require('../../models/coupon');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const session = new ObjectId('678e69ab60f79e1c8daa2f71');

exports.addToCart = async (req, res) => {
    try {
        const { variantId, selectedSize, quantity } = req.body;

        // Check stock availability
        const variant = await Variant.findById(variantId);
        if (!variant || !variant.sizes[selectedSize] || variant.sizes[selectedSize] < quantity) {
            return res.status(400).json({ 
                message: `Not enough stock available for size ${selectedSize}`
            });
        }

        // Find cart and check for existing item
        let cart = await Cart.findOne({ user: session });
        const existingItemIndex = cart.items.findIndex(item => 
            item.variantId.toString() === variantId && 
            item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
            return res.status(400).json({ 
                exists: true,
                message: 'This item already exists in your cart'
            });
        }

        // Add new item to cart
        cart.items.push({ variantId, size: selectedSize, quantity });
        await cart.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: session });
        const coupons = await Coupon.find({
            status: 'Active',
            validity: { $gte: new Date() }
        });
        
        if (!cart) {
            return res.render('cart', { 
                items: [],
                coupons
            });
        }

        const cartItems = await Promise.all(cart.items.map(async (item) => {
            const variant = await Variant.findById(item.variantId);
            const product = await Product.findById(variant.productId);
            
            // Check if requested quantity is available for the selected size
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
                inStock,
                availableStock
            };
        }));

        res.render('../views/pages/user/cart', { 
            items: cartItems,
            totalAmount: calculateTotal(cartItems),
            coupons
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching cart');
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const { variantId, quantity, size2 } = req.body;

        // Check stock availability for the specific size
        const variant = await Variant.findById(variantId);
        if (!variant || !variant.sizes[size2] || variant.sizes[size2] < quantity) {
            return res.status(400).json({ 
                error: `Not enough stock available for size ${size2}`
            });
        }

        const cart = await Cart.findOne({ user: session });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.variantId.toString() === variantId && item.size === size2
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const { variantId } = req.body;
        const cart = await Cart.findOne({ user: session });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.variantId.toString() !== variantId
        );
        
        await cart.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({
            couponCode: code.toUpperCase(),
            status: 'Active',
            validity: { $gte: new Date() }
        });
        
        if (!coupon) {
            return res.status(400).json({ error: 'Invalid or expired coupon' });
        }

        const cart = await Cart.findOne({ user: session });
        const cartItems = await Promise.all(cart.items.map(async (item) => {
            const variant = await Variant.findById(item.variantId);
            const product = await Product.findById(variant.productId);
            return {
                quantity: item.quantity,
                price: product.discountPrice || product.price
            };
        }));

        const subtotal = calculateTotal(cartItems);
        
        if (subtotal < coupon.minAmount) {
            return res.status(400).json({ 
                error: `Minimum purchase amount of $${coupon.minAmount} required` 
            });
        }

        const discountAmount = coupon.discount;

        res.json({ 
            success: true, 
            discount: discountAmount,
            total: subtotal - discountAmount + 20
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

function calculateTotal(items) {
    return items.reduce((total, item) => 
        total + (item.discountPrice || item.price) * item.quantity, 0
    );
}