window.siteStore = Redux.createStore(
	function (state, action) {
		if (!state) {
			state = {
				someoneIsLoggedIn: null,
				userEnrolledCourses: []
			};
		}

		switch (action.type) {
			case 'CHECKED_IF_ANYONE_IS_LOGGED_IN':
				return Object.assign({}, state, {
					//store says, 'ok, I got an action thats telling me to change something in the state. Now, I
					//gotta tell all the guys who are susscribed to me that something may have changed.
					someoneIsLoggedIn: action.resultOfUserCheck
				});

			case 'CHECK_FOR_USER_COURSES':
				return Object.assign({}, state, {
					userEnrolledCourses: action.resultOfCoursesCheck
				});
			//don't need a break here because of the above return, but would otherwise.
		}

		return state;
	}
);

console.log('first', siteStore.getState());


siteStore.subscribe(function() {
	console.log('something');
	var currentState = siteStore.getState();

	if (currentState.someoneIsLoggedIn == null) {
		$ActiveDash.css('display', 'none')
		$LogOut.css('display', 'none');
		$LogMeIn.css('display', '');
		console.log('no one is logged in');
		$CreateLoginLink.css('display', '');
	}
	else {
		$LogOut.css('display', '');
		$ActiveDash.css('display', '');
		$Hi.text('Hi, ' + currentState.someoneIsLoggedIn);
		$Hi.css('text-transform', 'capitalize');
		$LogInDash.css('display', 'none');
		$LogMeIn.css('display', 'none');
		$CreateLoginLink.css('display', 'none');
	}
});



var $LogMeIn = $('#LogMeIn');
var $LogOut = $('#LogOut');
var $LogInDash = $('#LogInDash');
var $ActiveDash = $('#ActiveDash');
var $Hi = $('#Hi');
var $CreateLoginLink = $('#CreateLoginLink');
var $CreateNewLogin = $('#CreateNewLogin');

function checkWhoAmI() {
	$.ajax({
		url: '/user/whoami',
		success: function (data) {
			console.log('Got info back from whoami');

			//An action is a plain object with at least one property, which is type
			siteStore.dispatch({
				type: 'CHECKED_IF_ANYONE_IS_LOGGED_IN',
				resultOfUserCheck: data.username
			});
		}
	});
}

checkWhoAmI();

$CreateLoginLink.on('click', function(evt) {
	evt.preventDefault();
	$LogInDash.css('display', 'none');
	$CreateNewLogin.css('display', '');
});

$LogMeIn.on('click', function (evt) {
	evt.preventDefault();
	$CreateNewLogin.css('display', 'none');
	$LogInDash.css('display', '');
});

//Below: dealing with the data input on the new login creation form
$('#CreateNewLoginForm').on('submit', function(evt) {
	evt.preventDefault();

	var newUsernameEntered = $('#NewUsername').val();
	var newPasswordEntered = $('#NewPassword').val();
	var newPasswordConfirmEntered = $('#NewPasswordConfirm').val();

	if (newPasswordConfirmEntered !== newPasswordEntered) {
		console.log('Passwords must match');
	}

	else {
		$.ajax({
			url: '/user/newlogin?newusername=' + newUsernameEntered + '&newpassword=' + newPasswordEntered,
			success: function (data) {
				console.log(data.status);
				console.log(data.username);
				// below, checks that the server signed the right person in, gets rid of the new login bar, and checks
				// whoami function to get the rest of the page displayed correctly now that someone is logged in
				if (data.username === newUsernameEntered) {
					$CreateNewLogin.css('display', 'none');
					checkWhoAmI();
				}

			}
	});
	}

});

//Below: pops the data entered into a url to give to the server, and checks the result of what the server thinks
//about the accuracy of the login entered!
$('#studentLoginForm').on('submit', function(evt) {
	evt.preventDefault();

	var nameEntered = $('#userName').val();
	var passwordEntered = $('#password').val();

	$.ajax({
		url: '/user/login?username=' + nameEntered + '&password=' + passwordEntered,
		success: function(data) {
			console.log('success-got the data', data.status);
			var result = data.status;

			if (result === 'success') {
				checkWhoAmI();
			}
			else if (result === 'failure') {
				console.log(data.message);
			}
			else console.log('not sure what we got back from the route');

		},
		error: function() {
			console.log('error');
		}
	});
})

$LogOut.on('click', function(evt) {
	evt.preventDefault();
	$.ajax({
		url: '/user/loggingout',
		success: function(data) {
			checkWhoAmI();
		}
	})
});



