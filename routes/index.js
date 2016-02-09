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
	res.render('index');
});
