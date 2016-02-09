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

router.get('/enrolled', function(req, res) {
	res.json({
		user: 'andre', // TODO: Return the current logged in user
		courses: [100, 200] // TODO: Return the actual GUIDs the user is enrolled in
	});
});
