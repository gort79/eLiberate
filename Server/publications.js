if(Meteor.isServer) {
	// Organization subscription details
    Meteor.publish("organizations", function() {
      return Organizations.find({members: { $elemMatch: { userId: this.userId }}});
    });

	// Permission subscription details
	Meteor.publish("permissions", function(organizationId) {
	  return Permissions.find({organizationId: organizationId});
	});

	// Invite subscription details
	Meteor.publish("invites", function(organizationId) {
	  return Invites.find({organizationId: organizationId});
	});

	// Meeting subscription details
	Meteor.publish("meetings", function(organizationId) {
	  return Meetings.find({organizationId: organizationId});
	});

	// Message subscription details
	Meteor.publish("messages", function(meetingId) {
	  return Messages.find({meetingId: meetingId});
	});

	// Message subscription details
	Meteor.publish("queues", function(meetingId) {
	  return Queues.find({meetingId: meetingId});
	});
}