// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/admin/coupons');

// Render the admin coupons page
router.get('/', (req, res) => {
    res.render('../views/pages/admin/coupons');
});

// Create a new coupon
router.post('/add', couponController.addCoupon);

// Get all coupons
router.get('/get', couponController.getCoupons);

// Get a single coupon by ID
router.get('/:id', couponController.getCouponById);

// Update a coupon by ID
router.patch('/:id', couponController.updateCoupon);

// Delete a coupon by ID
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;