/**
 * This file is only for program consumed routes that are
 * related to logging in/out and managing user accounts
 *
 * Created by lexy on 2/8/16.
 */
var fs = require('fs');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
function potato() {
	 return mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'lexy',
		database : 'sfcc'
	});
}

module.exports = router;

/* GET users listing. */
router.get('/user', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/user/newlogin', function(req, res) {
	var newLoginName = req.query.newusername;
	var newPass = req.query.newpassword;

	var mysqlsession = potato();
	mysqlsession.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			res.json({
				status: 'failed',
				message: 'error connecting to database'
			});
			return;
		}

		console.log('connected as lexy ' + mysqlsession.threadId);

		// do something
		mysqlsession.query('INSERT INTO students SET ?', { username: newLoginName, password: newPass }, function(err){
			if (err) {
				console.error('error connecting: ' + err.stack);
				res.json({
					status: 'failed',
					message: 'error creating login'
				});
			}
			else {
				//line below is to log in the new user
				req.session.loggedInUser = newLoginName;
				res.json({
					status: 'success',
					username: newLoginName
				});
			}
		});
		mysqlsession.end();
	});

});

router.get('/user/whoami', function(req, res) {
	//setTimeout(function(){
	res.json({
		username: req.session.loggedInUser
	});
	//}, 1000);
});

router.get('/user/loggingout', function(req, res) {
	// Record what the username was before we clear it
	var oldUsername = req.session.loggedInUser;

	// Clear the username so they are no longer logged in
	req.session.loggedInUser = undefined;

	res.json({
		username: oldUsername
	});
});

router.get('/user/login', function(req, res) {
	var login = req.query.username;
	var pass = req.query.password;

	if (typeof login !== 'string') {
		res.json({
			status: 'fail',
			message: 'the "login" query param is required!'
		});

		return;
	}

	var mysqlsession = potato();

	mysqlsession.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}

		console.log('connected as lexy ' + mysqlsession.threadId);

		mysqlsession.query('SELECT password FROM students WHERE username = ?', [login], function (error, results) {
			if (error) {
				console.error('WARNONG');
				return;
			}

			//Remember about typing "debugger;' and checking the debug tab to check out the results array
			//to check out what's going on in results (just to help me)
			if (results.length !== 1) {
				res.json({
					status: 'failure',
					message: 'no such user'
				});
			}
			else if (pass !== results[0].password) {
				res.json({
					status: 'failure',
					message: 'password does not match'
				});
			}
			else {
				req.session.loggedInUser = login;
				res.json({
					status: 'success',
					message: 'You logged in'
				});
			}
		});

		mysqlsession.end();
	});

});

router.get('/shoppingcart', function(req, res) {
	res.render('student/shoppingcart');
});

router.get('/user/addclass', function(req, res) {
	var newClass = req.query.course;
	var userName = req.session.loggedInUser;

	var mysqlsession = potato();

	mysqlsession.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}

		console.log('connected as lexy ' + mysqlsession.threadId);

		mysqlsession.query('INSERT INTO enrollment SET ?', { username: userName, guid: newClass }, function(err){
			if (err) {
				console.error('error connecting: ' + err.stack);
				res.json({
					status: 'failed',
					message: 'error adding class'
				});
			}
			else {
				res.json({
					status: 'Got the new course info',
					message: 'Course added!'
				});
			}
		});

		mysqlsession.end();
	});
});

router.get('/user/enrolledguids', function(req, res) {

	var userName = req.session.loggedInUser;

	var mysqlsession = potato();
	mysqlsession.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as lexy ' + mysqlsession.threadId);

		mysqlsession.query('SELECT guid FROM enrollment WHERE username = ?', [userName], function (error, results) {
			var enrolledArray = results.map(function(item) {
				return item.guid;
			})

			 res.json({
			 status: 'success',
			 debug: 'junk',
			 data: {
			 courses: enrolledArray /*|| []*/
			 }
			 });
		});
		mysqlsession.end();
	});
})

router.get('/user/displayusercourses', function(req, res) {

	var userName = req.session.loggedInUser;

	var mysqlsession = potato();
	mysqlsession.connect(function (err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as lexy ' + mysqlsession.threadId);

		mysqlsession.query('SELECT enrollment.guid, courses.course_title AS "title" ' +
			'FROM enrollment JOIN courses ON (enrollment.guid = courses.guid) ' +
			'WHERE username = ?', [userName], function (error, results) {

			res.json({
				status: 'success',
				data: {
					courses: results
				}
			});
		})
		mysqlsession.end();
	})
});


