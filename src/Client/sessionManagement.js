if(Meteor.isClient) {
	Meteor.logout(function(err) {
	  // callback
	  //if(Session != null)
	  //{
		//Session.Clear();
		//Session.Abandon();
	  //}

	  Organizations.stop();
	  Meetings.stop();
	  Permissions.stop();
	  Invites.stop();

	  hideOrganizationMenu(); 
	});

	Template.home.helpers({
		created: function() {
		  if (Accounts._verifyEmailToken) {
			Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
			  if (err != null) {
				if (err.message = 'Verify email link expired [403]') {
				  return 'Sorry this verification link has expired.';
				}
			  } else {
				return 'Thank you! Your email address has been confirmed.';
			  }
			});
		  } 
		}
	});
}