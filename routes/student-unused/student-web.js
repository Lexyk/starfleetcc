/**
 * This file handles web (i.e. HTML) requests for faculty pages
 *
 * These are for human consumption, and not for programs to use (since these routes return HTML)
 *
 * Created by lexy on 2/8/16.
 */
var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/', function(req, res) {
	res.render('student/dashboard');
});

router.get('/enrolled', function(req, res) {
	res.render('student/enrolled');
});
