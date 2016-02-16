/**
 * Created by lexy on 10/25/15.
 */

console.log('using the guid');
$.ajax({
	url: '/public/data/' + window.coursenumberforindex + '.json',
	success: function (data) {
		console.log('success');
		$("#CourseTitle").text(data.title);

		$("#Subtitle").text(data.subtitle);

		//$("#CourseDescription").html(data.description);

		var $Staff = $('#Staff');

		for (var i = 0; i < data.staff.length; i++) {
			var $EachStaffMember = $("<li></li>").text(data.staff[i].title);
			$EachStaffMember.appendTo($Staff);
		}

		var $IteratedSubjects = $("#IteratedSubjects");

		for (var i = 0; i < data.subjects.length; i++) {
			//console.log(i)
			var $EachSubjectInArray = $("<li></li>").text(data.subjects[i].title);
			$EachSubjectInArray.appendTo($IteratedSubjects);
		}

		//console.log (data.labels.honor.title);
		var $HonorLabel = $('#HonorLabel')
		if (data.labels.honor.title === 'Honor') {
			$HonorLabel.html("<span>(Honor Course)</span>");
		}

		//console.log (data.description);
		var splitArray = data.description.split('</p>');
		//console.log (splitArray);
		var desiredHtml = splitArray[0];
		//console.log (desiredHtml);
		var $CourseDescription = $('#CourseDescription');
		$CourseDescription.html(desiredHtml);

	}
});


siteStore.subscribe(function () {
	var currentState = siteStore.getState();

	console.log(window.coursenumberforindex, currentState.userEnrolledCourses);

	if (currentState.someoneIsLoggedIn == null) {
		$EnrolledButton.css('display', 'none');
		$SignUpButton.css('display', 'none');
		return;
	}

	var conflict = false;
	for (var m = 0; m < currentState.userEnrolledCourses.length; m++) {
		if (window.coursenumberforindex == currentState.userEnrolledCourses[m]) {
			conflict = true;
			break;
		}
	}
	if (conflict) {
		console.log(currentState.userEnrolledCourses[m]);
		console.log('You are signed up for this class');
		$EnrolledButton.css('display', '');
		$SignUpButton.css('display', 'none');
	}
	else if (!conflict) {
		$EnrolledButton.css('display', 'none');
		$SignUpButton.css('display', '');
	}
	else {
		console.log('Enrollment uncertain');
	}


	//TODO: Just before for loop- variable "found it" = false. run through for loop.
	//TODO: in for loop, if I find it, set it to true. after for loop, look at boolean. break.
	//TODO: (gets it out of the closest set of braces). whereas return completely leaves function.
	//TODO: finish this.
	// TODO: (andre) This will just check the course array,
	// but we need to have some mechanism for calling
	// checkIfEnrolledInCourse when the signed in user actually changes (and maybe polling)
});

//'function wrapping' to keep this stuff 'private'. No more global variables.
(function() {
	var mostRecentKnownUserValue;

	siteStore.subscribe(function () {
		console.log('something');
		var currentState = siteStore.getState();

		if (currentState.someoneIsLoggedIn == null) {
			return;
		}
		else if (mostRecentKnownUserValue !== currentState.someoneIsLoggedIn) {
			//below, we're updating the value of currentState.someone... to the value of mostRecentKnownUserValue
			mostRecentKnownUserValue = currentState.someoneIsLoggedIn;
			checkIfEnrolledInCourse();
		}
	});
})()

function checkIfEnrolledInCourse() {
	$.ajax({
		url: '/user/displayusercourses',
		success: function (response) {
			console.log("Got the data back regarding enrolled courses", response.data.courses, window.coursenumberforindex);

			siteStore.dispatch({
				type: 'CHECK_FOR_USER_COURSES',
				resultOfCoursesCheck: response.data.courses
			});
		}
	});
}

var $SignUpButton = $('#SignUpButton');
var $EnrolledButton = $('#EnrolledButton');

$SignUpButton.on('click', function(evt) {
	event.preventDefault();
	console.log(window.coursenumberforindex);
	//console.log(window.someoneIsLoggedIn);
	$.ajax({
		url: '/user/addclass?course=' + window.coursenumberforindex,
		success: function (data) {
			console.log(data.status, data.message);
		}
	})
})

