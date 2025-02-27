var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.user='6780d0c40405ed40b957687d'
  const authentication = req.session.isAuthenticated;
  res.render('home',{authentication});
});



module.exports = router;
