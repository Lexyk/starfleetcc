/**
 * This file handles API requests for faculty-related actions (i.e. grade a student)
 *
 * APIs are for programing code consumption and not human consumption.
 *
 * Created by lexy on 2/8/16.
 */

var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/courses-teaching', function(req, res) {
	res.json({
		courses: [100,200]
	});
});
