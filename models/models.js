var mongoose = require('mongoose');
var ArticleSchema = mongoose.Schema;
// Define User schema 
var _Article = new ArticleSchema({
	title: String,
	content: String
}, {
	versionKey: false
});

_Article.statics = {
	fetch: function(cb) {
		return this
			.find()
			.exec(cb)
	},
	findById: function(id, cb) {
		return this.findOne({
			_id: id

		}).exec(cb);

	}
};

var UserSchema = mongoose.Schema;
// Define User schema 
var _User = new UserSchema({
	username: String,
	password: String
}, {
	versionKey: false
});

_User.statics = {
	fetch: function(cb) {
		return this
			.find()
			.exec(cb)
	},
	compare: function(username, password, cb) {
		return this
			.findOne({
				username: username
			}).findOne({
				password: password
			})
			.exec(cb)
	},
	findById: function(id, cb) {
		return this.findOne({
			_id: id

		}).exec(cb);

	}
};


// export them 
exports.Article = mongoose.model('Article', _Article);
exports.User = mongoose.model('User', _User);