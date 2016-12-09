var express = require('express');
var router = express.Router();
var express = require("express");
var mongoose = require('mongoose');
var models = require('../models/models');
var bodyParser = require('body-parser');
var showdown = require('showdown');
var session = require('express-session');
var fs = require("fs");
var _ = require('underscore');



mongoose.connect('mongodb://localhost/blog2');

var Article = models.Article;
var User = models.User;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

router.use(session({
	secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
	cookie: {
		maxAge: 60 * 1000 * 1000
	}
}));

router.use(function(req, res, next) {
	res.locals.user = req.session.user; // 从session 获取 user对象
	var err = req.session.error; //获取错误信息
	delete req.session.error;
	res.locals.message = ""; // 展示的信息 message
	if (err) {
		res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
	}
	next(); //中间件传递
});


/* GET home page. */
router.get('/', function(req, res, next) {

	Article.fetch(function(err, article) {
		if (err) {
			console.log(err)
		}
		if (req.session.user) {
			console.log(req.session.user.username)
			res.render('index', {
				title: 'Mustaxu',
				username: req.session.user.username,
				article: article,
				login: true
			})
		} else {
			console.log('not login')
			res.render('index', {
				title: 'Mustaxu',
				username: '游客',
				article: article
			})
		}

	})

});

router.get('/tag/:tag', function(req, res) {

	var tag = req.params.tag;
	Article.find({
		tags: tag
	}, function(err, article) {
		if (article.length > 0) {
			res.render('tag', {
				tag: tag,
				article: article,
				hasArticle: true
			})
		} else {
			res.render('tag', {
				tag: tag,
				hasArticle: false
			})
		}
	})



})

router.get('/reg', function(req, res, next) {

	User.fetch(function(err, user) {
		if (err) {
			console.log(err)
		}
		res.render('reg', {
			title: 'Mustaxu',
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
		req.session.user = null;
		req.session.user = userObj;
		res.redirect('/')
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
		var user = article.author
		console.log(user)
		var converter = new showdown.Converter(),
			text = article.content,
			html = converter.makeHtml(text);
		if (err) {
			console.log(err)
		}
		console.log(html)
		res.render('p', {
			user: req.session.user,
			title: 'Mustaxu',
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
	var user = req.session.user;
	var id = req.params.id;
	var title = req.body['article[title]'];
	var content = req.body['article[content]'];
	var tags = req.body['article[tags]'].split(/[ |,]/);
	if (user) {
		Article.findById(id, function(err, article2) {
			if (err) {
				console.log(err)
			}

			Article.update({
				_id: id
			}, {
				title: title,
				author: user.username,
				tags: tags,
				content: content

			}, function(err, docs) { //更新
				console.log(docs);
				console.log('update success');

			})

			res.redirect('/p/' + id);

		})
	} else {
		res.redirect('/login')
	}


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

router.get('/new', function(req, res) {

	var user = req.session.user;
	if (user) {

		Article.fetch(function(err, article) {
			if (err) {
				console.log(err)
			}
			res.render('new', {
				article: article
			})
		})
	} else {
		res.redirect('/login')
	}
})

router.get('/remove/:id', function(req, res) {

	var id = req.params.id;

	Article.remove({
		_id: id
	}, function(err, article) {
		if (err) {
			console.log(err)
		}
		res.redirect('/')
	})

})

router.post('/new', function(req, res) {
	var user = req.session.user;
	var article = req.body.article;
	var tags = req.body['article[tags]'].split(/[ |,]/);
	var articleObj = new Article({
		title: req.body['article[title]'],
		author: user.username,
		tags: tags,
		content: req.body['article[content]']
	});

	fs.writeFile("./post/" + req.body['article[title]'] + ".txt", articleObj.content, function(err) {
		if (err) throw err;
		console.log("File Saved !"); //文件被保存
	});

	articleObj.save(function(err, articleObj) {
		if (err) {
			console.log(err)
		}
		res.redirect('/')
	});

})

module.exports = router;