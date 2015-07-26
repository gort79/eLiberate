if(Meteor.isServer) {
	Accounts.onCreateUser(function(options, user) {
		 // we wait for Meteor to create the user before sending an email
		 Meteor.setTimeout(function() {
		Accounts.sendVerificationEmail(user._id);
		 }, 2 * 1000);
        
		 // Find any invites the user may have
		 invitedRoles = Invites.find({email: user.emails[0].address}).fetch();
        
		 // Add their permissions for all of the invites the user may have
		 for(i = 0; i < invitedRoles.length; i++)
		 {
			Permissions.insert({organizationId: invitedRoles[i].organizationId, userId: user._id, userName: user.username, role: invitedRoles[i].role });
		Invites.remove({email: user.emails[0].address});
		}
        
		 return user;
	});

	Meteor.methods({
	  inviteUser: function(email, orgName) {
		Email.send({
		  to: email,
		  subject: "You have been invited to join " + orgName + " on eLiberate",
		  text: "Join us..."
		});
	  }
	});
}