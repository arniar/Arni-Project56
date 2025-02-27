// controllers/couponController.js
const Coupon = require('../../models/coupon'); // Adjust the path accordingly

// Create a new coupon
exports.addCoupon = async (req, res, next) => {
    const { couponName, couponCode, discount, minAmount, validity, status } = req.body;

    const newCoupon = new Coupon({
        couponName,
        couponCode,
        discount,
        minAmount,
        validity,
        status
    });

    try {
        const savedCoupon = await newCoupon.save();
        res.status(201).json(savedCoupon);
    } catch (error) {
        next(error); // Forward error to the next middleware
    }
};

// Get all coupons
exports.getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        next(error); // Forward error to the next middleware
    }
};

// Get a single coupon by ID
exports.getCouponById = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        next(error); // Forward error to the next middleware
    }
};

// Update a coupon by ID
exports.updateCoupon = async (req, res, next) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCoupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(updatedCoupon);
    } catch (error) {
        next(error); // Forward error to the next middleware
    }
};

// Delete a coupon by ID
exports.deleteCoupon = async (req, res, next) => {
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!deletedCoupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        next(error); // Forward error to the next middleware
    }
};