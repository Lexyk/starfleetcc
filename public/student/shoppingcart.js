/**
 * Created by lexy on 12/15/15.
 */
var $thisUsersShoppingCart = $('#thisUsersShoppingCart');
var $thisUsersCourses = $('#thisUsersCourses');
var $UserCourseList = $('#UserCourseList');

// Search for the course quick info box template
var $ThisUsersCourseBox = $('#ThisUsersCourseBox');

// Remove the 'id' attribute from it
$ThisUsersCourseBox.removeAttr('id');

$.ajax({
	url: '/user/whoami',
	success: function (data) {
		$thisUsersShoppingCart.text(data.username + '\'s courses');
		$thisUsersShoppingCart.css('text-transform', 'capitalize');
	}
});

$.ajax({
	url: '/user/displayusercourses',
	success: function (response) {
		//the response.data.courses is referring to a route I wrote in users.js - was getting confused about where it was
		//coming from.
		console.log('found user courses', response.data.courses);

		for (var i = 0; i < response.data.courses.length; i++) {
			var $eachEnrolledCourse = $("<li></li>").text(response.data.courses[i].title + '/' + response.data.courses[i].guid);
			$eachEnrolledCourse.appendTo($UserCourseList);
		}
	}
})


