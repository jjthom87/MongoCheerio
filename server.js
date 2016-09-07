var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');

var User = require('./User.model');

var db = 'mongodb://localhost/mongocheerio1';

mongoose.connect(db);

app.use('/static', express.static('public/assets'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req,res){
	User.find({}).exec(function(err, results){
		if(err){
			res.send('OMG ERROR');
		} else {
			res.render('index', {comments: results});		
		}
	});
});

app.post('/comment', function(req,res){
	User.create({
		comment: req.body.comment,
		status: true
		}, function(err){
		if (err) {
			res.send('error')
		} else {
			res.redirect('/');
		}
	})
})

app.put('/update', function(req,res){
	User.update({
		status: true},{$set: {status: false}
	}, function (err, book){
		if (err){
			res.send('error');
		} else {
			console.log('book deleted');
			res.redirect('/');
		}
	})
})

var PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log('database operation on port: ' + PORT);
 });