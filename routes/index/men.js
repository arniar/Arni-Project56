var express = require('express');
var router = express.Router();
const { getProductsByMainCategory } = require('../../controllers/index/men');

/* GET home page. */
router.get('/', getProductsByMainCategory);

module.exports = router;