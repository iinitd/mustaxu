var express = require('express');
var router = express.Router();
var express = require("express");
var mongoose = require('mongoose');
var models = require('../models/models');
var bodyParser = require('body-parser');
var showdown = require('showdown');
var session = require('express-session');
var _ = require('underscore');



mongoose.connect('mongodb://localhost/blog2');

var Article = models.Article;
var User = models.User;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

router.use(session({
	secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
	cookie: {
		maxAge: 60 * 1000
	}
}));


/* GET home page. */
router.get('/', function(req, res, next) {



	Article.fetch(function(err, article) {
		if (err) {
			console.log(err)
		}
		if (req.session.user) {
			console.log(req.session.user.username)
			res.render('index', {
				username: req.session.user.username,
				article: article
			})
		} else {
			console.log('not login')
			res.render('index', {
				username: 'anonoymous',
				article: article
			})
		}

	})

});

router.get('/reg', function(req, res, next) {

	User.fetch(function(err, user) {
		if (err) {
			console.log(err)
		}
		res.render('reg', {
			user: user
		})
	})

});

router.get("/logout", function(req, res) { // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
});


router.post('/reg', function(req, res) {
	var username = req.body.username;
	var password = req.body.password
	var userObj = new User({
		username: username,
		password: password
	});
	userObj.save(function(err, userObj) {
		if (err) {
			console.log(err)
		}
		res.redirect('/reg')
	});

})

router.post('/login', function(req, res, next) {

	var username = req.body.username,
		password = req.body.password;

	User.findOne({
		username: username
	}, function(err, ures) {
		if (err) {
			console.log(err)
		} else if (!ures) {
			console.log('username not found');
			req.session.error = '用户名不存在';
			res.redirect("/login");
		} else if (password != ures.password) {
			console.log('wrong password')
			req.session.error = "密码错误";
			res.redirect("/login");
		} else {
			console.log('success')
			req.session.user = ures;
			res.redirect("/");
		}

	})

});

router.get('/login', function(req, res, next) {

	res.render('login', {})

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

		var converter = new showdown.Converter(),
			text = article.content,
			html = converter.makeHtml(text);
		if (err) {
			console.log(err)
		}
		console.log(html)
		res.render('p', {
			article: article,
			html: html
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