/**
 * This file is only for human consumed routes that
 * do not fit within a categorized route file
 *
 * Created by lexy on 2/8/16.
 */
var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/', function(req, res) {
	res.render('homepage');
});

router.get('/coursecatalog', function(req, res) {
	res.render('course/coursecatalog');
});

//the /courses below is looking for /courses in the url, not in any directory of mine. I set it.
//Also, the res.render knows where to look due to the app.js file, in which I told it on lines 14 &15
//where it should look for views.
router.get('/findacourse', function(req, res) {
	res.render('course/findacourse');
});

router.get('/courseinformation/:guid', function(req, res) {
	//the second argument below, is a plain object, and this is the way to pass data (you're telling it which json file to refer to!) on to the template (the ejs file)
	res.render('course/courseinformation', {
		coursenumber: req.params.guid,
	});
});

module.exports = router;
