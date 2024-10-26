var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let username=req.session.username || "Guest";
  res.render('index', { 
    title: 'Census Application',
    username:username});
});

module.exports = router;
