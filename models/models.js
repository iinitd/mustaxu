var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define User schema 
var _User = new Schema({
	email: String,
	name: String
});

_User.statics = {
	fetch: function(cb) {
		return this
			.find()
			.exec(cb)
	},
	findById: function(cb) {
		return this
			.findOne({
				_name: name
			})
			.exec(cb)
	}
};
// export them 
exports.User = mongoose.model('User', _User);