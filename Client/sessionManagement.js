if(Meteor.isClient) {
	Template.login.events({
		'click #login-buttons-logout': function(event, template) {
			userLeaving();
		}
	});

	$(window).bind('beforeunload', function() {
            userLeaving();
        }
    );

	Tracker.autorun(function(){
		if(Meteor.userId()){
			Meteor.subscribe("meetings");
			Meteor.subscribe("agendas");
			Meteor.subscribe("attendees");
			Meteor.subscribe("comments");
		}
	});

	function userLeaving() {
		leaveMeeting(Meteor.userId(), Session.get("organizationId"), Session.get("meetingId"));

		Session.set('meetingId', undefined);
		Session.set('organizationId', undefined);
		Session.set('ruleset', undefined);
		delete Session.keys.organizationId;
		delete Session.keys.ruleset;
	}

	Template.login.helpers({
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
