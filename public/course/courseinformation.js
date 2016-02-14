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

/*if (window.someoneIsLoggedIn === undefined) {
	var noUser = true;
}
if (window.someoneIsLoggedIn == false) {
	var stillNoUser = true;
}
if (window.someoneIsLoggedIn == true) {
	foundUser = true;
} */

/*console.log('about to check if someone is logged in');
if (window.someoneIsLoggedIn === true) {
	console.log(someoneIsLoggedIn + ' is logged in!!!!');
	broadcaster.sendMessage('USER_CONFIRMED');
}*/

//Put the following function re:broadcaster in this file, because the function it's calling (checkIfEnrolledInCourse) is
//in this file!  So it will know what the heck you are talking about.
//broadcaster.addListener(function(message) {
	//if (message === 'USER_CONFIRMED') {
		//checkIfEnrolledInCourse();
	//}
	//else if (message === 'USER_LOGIN') {
		//checkIfEnrolledInCourse();
	//}
	//else if (message === 'USER_LOGOUT') {
		//checkIfEnrolledInCourse();
	//}
//});

siteStore.subscribe(function () {
	var currentState = siteStore.getState();

//TODO: finish this.
	// TODO: (andre) This will just check the course array,
	// but we need to have some mechanism for calling
	// checkIfEnrolledInCourse when the signed in user actually changes (and maybe polling)
});

function checkIfEnrolledInCourse() {
	$.ajax({
		url: '/user/displayusercourses',
		success: function (response) {
			console.log("Got the data back regarding enrolled courses", response.data.courses, window.coursenumberforindex);

			for (var m = 0; m < response.data.courses.length; m++) {
				if (window.coursenumberforindex == response.data.courses[m]) {
					console.log('You are signed up for this class');
					var $EnrolledButton = $('#EnrolledButton');
					$EnrolledButton.css('display', '');
				}
				else {
					$SignUpButton.css('display', '');
				}
			}
		}
	});
}

var $SignUpButton = $('#SignUpButton');
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

