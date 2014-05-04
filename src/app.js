var express = require('express');
var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade');


app.get('/', function (req, res) {
	res.render('index', {
		title : 'Home'
	});
});

var server = app.listen(process.env.PORT, function() {
	console.log('Listening on port %d', server.address().port);
});
