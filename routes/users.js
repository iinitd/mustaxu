var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models/models');
var bodyParser = require('body-parser');
var showdown = require('showdown');
var _ = require('underscore');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});



module.exports = router;