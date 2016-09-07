var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PitchforkSchema = new Schema({
	title: String,
	status: Boolean
});

module.exports = mongoose.model('Pitchfork', PitchforkSchema);