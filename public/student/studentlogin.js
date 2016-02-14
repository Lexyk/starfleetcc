
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

			// Turn 'data.username' into a boolean by double 'not'ing it
			// then compare it to window.someoneIsLoggedIn
			// If we haven't checked the logged in user before, window.someoneIsLoggedIn will be 'undefined'
			// That means it would be (false === undefined)
			// If we have previously checked if the user was logged in, it would be
			// (false === false) which would skip the rest of the code
			//if (!!data.username === window.someoneIsLoggedIn) {
				//return;
			//}

			if (data.username == null) {
				window.someoneIsLoggedIn = false;
				$LogOut.css('display', 'none');
				$LogMeIn.css('display', '');
				console.log('no one is logged in');
				$CreateLoginLink.css('display', '');
			}
			else {
				window.someoneIsLoggedIn = data.username;
				//broadcaster.sendMessage('USER_CONFIRMED');
				$LogOut.css('display', '');
				$ActiveDash.css('display', '');
				console.log(someoneIsLoggedIn);
				$Hi.text('Hi, ' + window.someoneIsLoggedIn);
				$Hi.css('text-transform', 'capitalize');
				$LogInDash.css('display', 'none');
				$LogMeIn.css('display', 'none');
				$CreateLoginLink.css('display', 'none');
			}
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

			if (result === 'loginsuccessful') {
				console.log('yep');
				checkWhoAmI();
				//broadcaster.sendMessage('USER_LOGIN');

				//window.location.replace('http://localhost:3000/coursecatalog');

			}
			else if (result === 'loginfailed') {
				console.log('nope');
			}
			else console.log('neither');

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
			//window.location.replace('http://localhost:3000/coursecatalog');
			//console.log(data.username + ' successfully logged out!')

			//broadcaster.sendMessage('USER_LOGOUT');
			checkWhoAmI();
		}
	})
});



