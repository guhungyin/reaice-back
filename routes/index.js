var express = require('express');
var router = express.Router();
var firebaseAdminDb = require('../connections/firebase_admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
