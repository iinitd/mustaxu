var express = require('express');
var router = express.Router();
var express = require("express");
var mongoose = require('mongoose');
var models = require('../models/models');
var bodyParser = require('body-parser');
var _ = require('underscore');


mongoose.connect('mongodb://localhost/blog2');

var Article = models.Article;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded());


/* GET home page. */
router.get('/', function(req, res, next) {

	Article.fetch(function(err, article) {
		if (err) {
			console.log(err)
		}
		res.render('index', {
			article: article
		})
	})

});

/* GET home page. */
router.get('/list', function(req, res, next) {

	Article.fetch(function(err, article) {
		if (err) {
			console.log(err)
		}
		res.render('list', {
			article: article
		})
	})

});

router.get('/p/:id', function(req, res) {

	var id = req.params.id;
	Article.findById(id, function(err, article) {
		if (err) {
			console.log(err)
		}
		res.render('detail', {
			article: article
		})
	})

});

router.get('/edit/:id', function(req, res) {

	var id = req.params.id;
	Article.findById(id, function(err, article) {
		if (err) {
			console.log(err)
		}
		res.render('edit', {
			article: article
		})
	})

});

router.post('/edit/:id', function(req, res) {
	var id = req.params.id;
	var title = req.body['article[title]'];
	var content = req.body['article[content]']
	Article.findById(id, function(err, article2) {
		if (err) {
			console.log(err)
		}

		Article.update({
			_id: id
		}, {
			title: title,
			content: content
		}, function(err, docs) { //更新
			console.log(docs);
			console.log('update success');

		})

		res.redirect('/p/' + id);

	})

})


router.get('/test', function(req, res) {
	res.render('index', {
		title: 'index',
		articles: [{
			title: 'hh',
			_id: 3,
			poster: 'h'
		}]
	})
})

router.get('/admin', function(req, res) {



	Article.fetch(function(err, article) {
		if (err) {
			console.log(err)
		}
		res.render('admin', {
			article: article
		})
	})
})

router.post('/admin', function(req, res) {
	var article = req.body.article;
	var articleObj = new Article({
		title: req.body['article[title]'],
		content: req.body['article[content]']
	});
	articleObj.save(function(err, articleObj) {
		if (err) {
			console.log(err)
		}
		res.redirect('/list')
	});

})


router.get('/name', function(req, res) {

	User.findById(function(err, user) {
		if (err) {
			console.log(err)
		}
		res.send(article)
	})

})



module.exports = router;