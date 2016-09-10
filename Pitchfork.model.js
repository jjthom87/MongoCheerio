var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PitchforkSchema = new Schema({
	title: String,
	image: String,
	link: String,
	status: Boolean,
	user: [{
  		// store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // the ObjectIds will refer to the ids in the Note model
      ref: 'User'
  }]
});



module.exports = mongoose.model('Pitchfork', PitchforkSchema);