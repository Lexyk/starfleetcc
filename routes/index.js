/**
 * This file is only for human consumed routes that
 * do not fit within a categorized route file
 *
 * Created by lexy on 2/8/16.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
function cauliflower() {
	return mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'lexy',
		database : 'starfleetcc'
	});
}

module.exports = router;

router.get('/', function(req, res) {
	res.render('homepage');
});

/*router.get('/coursecatalog', function(req, res) {
	res.render('course/coursecatalog');
}); */

router.get('/coursecatalog', function(req, res) {
	var mysqlsession = cauliflower();
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

		mysqlsession.query('SELECT subject, subject_id FROM subject', function(err, subjectRecords) {
			if (err) {
				console.error('error getting subjects: ' + err.stack);
			}
			else {
				res.render('course/coursecatalog', {
					recordOfSubjects: subjectRecords
				});
			}
		})
		mysqlsession.end();
	})
});

router.get('/coursecatalog/bysubject/:id', function(req, res) {
	var mysqlsession = cauliflower();

	var subjectId = req.params.id;

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

		mysqlsession.query('SELECT subject, subject_id FROM subject', function(err, subjectRecords) {
			if (err) {
				console.error('error getting subjects: ' + err.stack);
				res.json({
					status: 'failed',
					message: 'error getting subjects'
				});
				return;
			}
			else {
				//The following shows how to reference a js variable in a mysql query (subjectId, which fyi is declared
				// at the top of this route)
				mysqlsession.query('SELECT c.title FROM course AS c' +
					' JOIN course_subject AS cs ON (c.guid = cs.guid)' +
					' WHERE cs.subject_id = ?', [subjectId], function(err, courseRecords) {
					if (err) {
						console.error('error getting courses for that subject' + err.stack);
					}
					else {
						res.render('course/coursecatalog', {
							recordOfSubjects: subjectRecords,
							recordOfCourses: courseRecords
						});
					}
				})
				mysqlsession.end();
			}
		});
	});
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
