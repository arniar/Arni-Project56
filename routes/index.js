var express = require('express');
var router = express.Router();


const menRouter = require('./index/men')
const womenRouter = require('./index/women')
const kidRouter = require('./index/kid')
const shopRouter = require('./index/shop')
const searchRouter = require('./index/search')
const overviewRouter = require('./index/overview')

/* GET home page. */
router.get('/', function(req, res, next) {

  const authentication = req.session.isAuthenticated;
  res.render('../views/pages/index/home.ejs',{authentication});
});

router.use('/men',menRouter);
router.use('/women',womenRouter);
router.use('/kid',kidRouter);
router.use('/shop',shopRouter);
router.use('/search',searchRouter);
router.use('/overview',overviewRouter);

module.exports = router;
