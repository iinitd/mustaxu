var express = require('express');
var router = express.Router();
var express = require("express");
var mongoose = require('mongoose');
var models = require('../models/models');
var bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/blog2');

var User = models.User;


router.use(bodyParser.urlencoded({
	extended: true
}));

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/test', function(req, res) {
	res.render('index', {
		title: 'index',
		users: [{
			title: 'hh',
			_id: 3,
			poster: 'h'
		}]
	})
})

router.get('/admin', function(req, res) {



	User.fetch(function(err, user) {
		if (err) {
			console.log(err)
		}
		res.render('admin', {
			user: user
		})
	})
})

router.post('/admin', function(req, res) {
	var user = req.body.user;
	var userObj = new User({
		email: req.body['user[email]'],
		name: req.body['user[name]']
	});
	userObj.save(function(err, userObj) {
		if (err) {
			console.log(err)
		}
		res.redirect('/admin')
	});

})

//admin post user
router.post('/admin', function(req, res) {
	var id = req.body.user._id;
	var userObj = req.body.user;
	var _user;
	if (id !== undefined) {
		User.findById(id, function(err, user) {
			if (err) {
				console.log(err);
			}
			_user = _.extend(user, userObj);
			_user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/admin/');
			});
		});
	} else {
		_user = new User({
			email: req.body['user[email]'],
			name: req.body['user[name]']
		});
		_user.save(function(err, user) {
			if (err) {
				console.log(err);
			}
			res.redirect('/admin/');
		});
	}
});


router.get('/name', function(req, res) {

	User.fetch(function(err, user) {
		if (err) {
			console.log(err)
		}
		res.send(user)
	})

})

router.get('/init', function(req, res) {
	var user = new User({
		email: 'nowind_lee @qq.com',
		name: 'Freewind'
	});
	user.save();
	res.send(user.name);
});


router.get('/user', function(req, res) {
	res.send('users');
});



module.exports = router;