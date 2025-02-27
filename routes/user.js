var express = require('express');
var router = express.Router();

const PIRouter = require('./user/personalInformation');
const ADRRouter = require('./user/manageAddress');
const cartRouter = require('./user/cart');
const checkoutRouter = require('./user/checkout');
const orderRouter = require('./user/orders');

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (!req.user || typeof req.user !== 'object' || !req.session.isAuthenticated) {
        return res.redirect('/auth/login');
    }
    next();
}


// Apply authentication middleware
router.use(isAuthenticated);

router.use('/pI', PIRouter);
router.use('/adr', ADRRouter);
router.use('/cart', cartRouter);
router.use('/checkout', checkoutRouter);
router.use('/order', orderRouter);

router.post('/logout', async (req, res) => {
    try {
        // Only clear admin-specific session data
        req.session.isAuthenticated = false;  // Clear admin authentication
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error during logout' });
    }
});

module.exports = router;
