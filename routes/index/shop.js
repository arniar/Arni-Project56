var express = require('express');
var router = express.Router();
const { getProducts } = require('../../controllers/index/shop');

/* GET shop page. */
router.get('/', getProducts);

module.exports = router;