var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	comment: String
});

module.exports = mongoose.model('User', UserSchema);