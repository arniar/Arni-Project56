// routes/checkoutRoutes.js
var express = require('express');
var router = express.Router();
var checkoutController = require('../../controllers/user/checkout');

router.get('/', checkoutController.getCheckoutPage);
router.post('/addresses', checkoutController.createAddress);
router.patch('/addresses/:id', checkoutController.editAddress);
router.patch('/addresses/:id/select', checkoutController.selectPrimaryAddress);
router.get('/addresses/primary',()=>{
     console.log("hi i am here")
},checkoutController.getPrimaryAddress);
router.get('/addresses', checkoutController.getAllAddresses);
router.post('/place-order', checkoutController.placeOrder);

module.exports = router;