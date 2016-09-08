var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var request = require('request');
var cheerio = require('cheerio');

var User = require('./User.model');
var Pitchfork = require('./Pitchfork.model');

var db = 'mongodb://localhost/mongocheerio1';

mongoose.connect(db);

app.use('/static', express.static('public/assets'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

request('http://pitchfork.com/reviews/albums/', function(err, response, html){
	if (err) {
		throw err
	}

	var $ = cheerio.load(html);
	var results = []

	$('.review').each(function(index, element){
		var title = $(element).find('h2').first().text();
		var image = $(element).find('img').first().attr('src');
		var link = $(element).find('a').first().attr('href');

		results.push({
			title: title,
			image: image,
			link: link
		});
	});
	results.forEach(function(result){
		Pitchfork.insertMany([{
			title: result.title,
			image: result.image,
			link: result.link,
			status: true
		}]);
	});
});

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
	}, function (err){
		if (err){
			res.send('error');
		} else {
			res.redirect('/');
		}
	});
});

app.get('/api', function(req,res){
	Pitchfork.find({}).exec(function(err, results){
		if(err){
			res.send('Error');
		} else {
			res.json(results);
		}
	});
});

var PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log('database operation on port: ' + PORT);
 });