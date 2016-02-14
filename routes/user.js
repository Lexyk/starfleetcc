/**
 * This file is only for program consumed routes that are
 * related to logging in/out and managing user accounts
 *
 * Created by lexy on 2/8/16.
 */
var fs = require('fs');
var express = require('express');
var router = express.Router();

module.exports = router;

var userNames = {};
var userCourses = {};

// Read previously saved users and passwords
fs.readFile('./runtime/usernames.json', {encoding: 'utf8'}, function (err, data) {
	//if (err) throw err;

	// if file exists, parse json and set to userNames
	if (!err) {
		userNames = JSON.parse(data);
		console.log('loaded usernames');
	}
	else {
		console.log('Can\'t load usernames');
	}
});

/* GET users listing. */
router.get('/user', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/user/newlogin', function(req, res) {
	var newLoginName = req.query.newusername;
	var newPass = req.query.newpassword;

	if (userNames[newLoginName]) {
		res.json({
			status: 'failed',
			message: 'Login not available',
		})
	}

	else {
		console.log('before', userNames);
		userNames[newLoginName] = newPass;
		//line below is to log in the new user
		req.session.loggedInUser = newLoginName;
		// the stuff in the res.json is data that is accessible client side. the below can be referred to in the client side
		// code as data.status
		res.json({
			status: 'Received the new user info',
			username: req.session.loggedInUser
		});

		// we can put just (userNames) below, because we stated a few lines up that it should take the object called userNames
		// and add to it a new property/key -the value of newLoginName- and a new value for that key - the value of newPass.
		fs.writeFile('./runtime/usernames.json', JSON.stringify(userNames), function(err) {
			if (err) {
				console.log('whoops')
			}
		});

		// Log the object again to see the changes
		console.log('after', userNames);
	}
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

	var correctPass = userNames[login];
	//var usernameExists = userNames.hasOwnProperty(login);

	if (typeof correctPass === 'string' && pass === correctPass) {
		// record who is logged in for the session
		req.session.loggedInUser = login;

		res.json({
			status: 'loginsuccessful'
		});
	}
	else {
		res.json({
			status: 'loginfailed',
			message: ''
		});
	}

});

router.get('/shoppingcart', function(req, res) {
	res.render('student/shoppingcart');
});

fs.readFile('./runtime/usercourses.json', {encoding: 'utf8'}, function (err, data) {
	if (!err) {
		userCourses = JSON.parse(data);
		console.log('loaded user course data');
	}
	else {
		console.log('Can\'t load user course data');
	}
});

router.get('/user/addclass', function(req, res) {
	var newClass = req.query.course;
	var userName = req.session.loggedInUser;

	//is it necessary to assign this variable? I'm not referring to it below; should I be?
	var coursesForTheUser = userCourses[userName];

	// If we do not yet have an array for the user,
	// create a new array (i.e. "[newClass]") and set it to the userCourses object
	if (!userCourses[userName]) {
		userCourses[userName] = [newClass];
	}

	//console.log(userCourses[userName], newClass);
	else if (userCourses[userName].indexOf(newClass) >= 0) {
		res.json({
			status: 'error',
			message: 'You are already signed up for that course!'
		});

		// Exit the function immediately to avoid further code from executing
		return;
	}

	// If we already have an array of courses for the user,
	// just push the new course to the existing array
	else {
		userCourses[userName].push(newClass);
	}

	res.json({
		status: 'Got the new course info'
	});

	fs.writeFile('./runtime/usercourses.json', JSON.stringify(userCourses), function (err) {
		if (err) {
			console.log('problem writing the user course data')
		}
	});
});

router.get('/user/displayusercourses', function(req, res) {
	var userName = req.session.loggedInUser;
	var userCourseArray = userCourses[userName];
	res.json({
		status: 'success',
		debug: 'junk',
		data: {
			courses: userCourseArray || []
		}
	});
})

