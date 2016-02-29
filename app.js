var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var mysql      = require('mysql');
var mysqlsession = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'lexy',
	database : 'sfcc'
});

mysqlsession.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log('connected as lexy ' + mysqlsession.threadId);

	// do something

	mysqlsession.query('SELECT count(*) AS cnt FROM students', function(err, rows) {
		if (err) throw err;

		console.log(rows[0].cnt);
	});

	mysqlsession.end();
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-mate'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use('/', require('./routes/index'));
app.use('/', require('./routes/user'));

//app.use('/course', require('./routes/course/course-web'));
//app.use('/api/course', require('./routes/course/course-api'));;
//
//app.use('/student', require('./routes/student/student-web'));
//app.use('/api/student', require('./routes/student/student-api'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
