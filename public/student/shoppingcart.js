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

function showListOfCourses(userCourses, courseGuidsAndTitles) {
	for (var i = 0; i < userCourses.length; i++) {
		var lonelyGuid = userCourses[i];

		for (var k = 0; k < courseGuidsAndTitles.length; k++) {
			var matchingGuid = courseGuidsAndTitles[k].guid;
			if (lonelyGuid == matchingGuid) {

				var $copyOfTheUserCourseBoxTemplate = $ThisUsersCourseBox.clone();

				//$copyOfTheUserCourseBoxTemplate.css('display', '');

				// Find the guid element within the cloned template
				var $matchingCourseTitle = $copyOfTheUserCourseBoxTemplate.find('.matchingCourseTitle');
				$matchingCourseTitle.text(courseGuidsAndTitles[k].coursename);

				var $theGuid = $copyOfTheUserCourseBoxTemplate.find('.theGuid');
				$theGuid.text(lonelyGuid);

				var $ListOfYourCourses = $('#ListOfYourCourses');
				var $listOfYourCoursesListItem = $("<li></li>").append($copyOfTheUserCourseBoxTemplate);
				$listOfYourCoursesListItem.appendTo($ListOfYourCourses);
			}
		}
	}
}

$.ajax({
	url: '/user/displayusercourses',
	success: function (response) {
		//the response.data.courses is referring to a route I wrote in users.js - was getting confused about where it was
		//coming from.
		console.log('found usercourses', response.data.courses);

		$.ajax({
			url: '/public/data/courseguidsandtitles.json',
			success: function (data) {
				console.log('got the course guids and titles');

				showListOfCourses(response.data.courses, data);
			}
		})
	}
})

