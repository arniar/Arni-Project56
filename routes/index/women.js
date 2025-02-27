var express = require('express');
var router = express.Router();
const { getProductsByMainCategory } = require('../../controllers/index/women');

/* GET women page. */
router.get('/', getProductsByMainCategory);

module.exports = router;