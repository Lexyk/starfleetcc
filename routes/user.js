/**
 * This file is only for program consumed routes that are
 * related to logging in/out and managing user accounts
 *
 * Created by lexy on 2/8/16.
 */
var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/whoami', function(req, res) {
	res.json({
		user: 'nobody!'
	});
});
