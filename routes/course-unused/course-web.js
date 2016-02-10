/**
 * This file handles web (i.e. HTML) requests for course-related pages
 *
 * These are for human consumption, and not for programs to use (since these routes return HTML)
 *
 * Created by lexy on 2/8/16.
 */
var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/info/:guid', function(req, res) {
	res.render('course/info', { guid: req.params.guid });
});

router.get('/search', function(req, res) {
	res.render('course/search');
});
