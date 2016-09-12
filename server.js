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

var db = 
process.env.MONGODB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/mongocheerio1';

mongoose.connect(db, function(err,res){
	if(err){
		console.log("Error connection to: " + db + '. ' + err);
	} else {
		console.log("Succeeded connecting to: " + db);
	}
});

app.use('/static', express.static('public/assets'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// app.get('/scrape', function(req,res){	
request('http://pitchfork.com/reviews/albums/', function(err, response, html){
	if (err) {
		throw err
	}

	var $ = cheerio.load(html);
	// var results = {};
	var results = [];

	$('.review').each(function(index, element){
		// results.title = $(element).find('h2').first().text();
		// results.image = $(element).find('img').first().attr('src');
		// results.link = $(element).find('a').first().attr('href');
		var title = $(element).find('h2').first().text();
		var image = $(element).find('img').first().attr('src');
		var link = $(element).find('a').first().attr('href');

		// var album = new Pitchfork(results);

		// album.save(function(err,doc){
		// 	if (err){
		// 		console.log(err)
		// 	} else {
		// 		console.log(doc);
		// 	}
		// });
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
// 	res.send("Scrape Complete");
// });

app.get('/', function(req,res){
	User.find({}).exec(function(err, results){
		if(err){
			res.send('OMG ERROR');
		} else {
			res.render('index', {comments: results});		
		}
	});
});

// app.get('/', function(req,res){
// 	res.render('index');		
// });

// app.get('/', function(req,res){
// 	Pitchfork.find({}).exec(function(err, results){
// 		if(err){
// 			res.send('Error');
// 		} else {
// 			res.render('index', {results: results});
// 		}
// 	});
// });

app.get('/api', function(req,res){
	Pitchfork.find().populate('user').exec(function(err, results){
		if(err){
			res.send('Error');
		} else {
			res.send(results);
		}
	});
});

// app.post('/comment', function(req,res){
// 	User.create({
// 		comment: req.body.comment,
// 		status: true
// 		}, function(err, doc){
// 		if (err) {
// 			res.send('error')
// 		} else {
// 			Pitchfork.findOneAndUpdate({}, {$push: 
// 				{'users': doc._id}}, {new: true},
// 				function(err){
// 					if(err){
// 						res.send(err);
// 					} else {
// 						res.send(doc);
// 					}
// 			})
// 		}
// 	})
// })

app.post('/api/:id', function(req,res){
	var newComm = new User(req.body);

	newComm.save(function(err,doc){
		if (err){
			console.log(err)
		} else {
			Pitchfork.findOneAndUpdate({'_id': req.params.id}, { $push: {'user': doc._id}}, {new: true}).exec(function(err,doc){
				if(err){
					console.log(err)
				} else {
					res.send(doc);
				}
			})
		}
	})
})

// app.put('/update', function(req,res){
// 	User.update({
// 		status: true},{$set: {status: false}
// 	}, function (err,doc){
// 		if (err){
// 			res.send('error');
// 		} else {
// 			res.send(doc);
// 		}
// 	});
// });

app.get('/api/:id', function(req,res){
	Pitchfork.findOne({'_id': req.params.id}).populate('user').exec(function(err,doc){
		if (err){
			console.log(err)
		} else {
			res.send(doc)
		}
	});
});

var PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log('database operation on port: ' + PORT);
 });