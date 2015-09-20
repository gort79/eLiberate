if(Meteor.isServer) {
	Meteor.startup(function() {
	  Meteor.methods({
		// Organization is admin check
		isOrganizationAdmin: function(organizationId, userId) {
		  if(Permissions.find({organizationId: organizationId, userId: userId, $or: [ { role: ROLES.administrator }, { role: ROLES.chairperson} ] }).count() > 0)
		  {
			return true;
		  }

		  return false;
		},

		findUserIdByEmail: function(address) {
			user = Meteor.users.find({emails: { $elemMatch: { address: address}}}, {_id: true, userName: true}).fetch();
			if(user.length > 0)
			{
				return user[0];
			}

			return null;
		},

		// Meeting methods
		joinMeeting: function(userId, organizationId, meetingId) {
			if(Permissions.find({organizationId: organizationId, userId: userId}).count() > 0
				&& Attendees.find({meetingId: meetingId, userId: userId}).fetch() == 0)
			{
				Attendees.insert({meetingId: meetingId, userId: userId});
			}
		},

		leaveMeeting: function(userId, organizationId, meetingId) {
			attendees = Attendees.find({userId: userId}).fetch();
			if(attendees.length > 0)
			{
				for(var i = 0; i < attendees.length; i++)
				{
					Attendees.remove({_id: attendees[i]._id});
				}
			}
		}
	  })
	});
}
