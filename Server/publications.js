if(Meteor.isServer) {
	// Organization subscription details
    Meteor.publish("organizations", function() {
		var permissions = Permissions.find({ userId: this.userId }, { organizationId: 1, _id:0, userId: 0, userName: 0, role: 0 }).fetch();

		var orgIds = [];
		for(i = 0; i < permissions.length; i++) {
			orgIds.push(permissions[i].organizationId);
		}

		return Organizations.find({_id: { $in: orgIds }});
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
	Meteor.publish("meetings", function() {
		var permissions = Permissions.find({ userId: this.userId }, { organizationId: 1, _id:0, userId: 0, userName: 0, role: 0 }).fetch();

		var orgIds = [];
		for(i = 0; i < permissions.length; i++) {
			orgIds.push(permissions[i].organizationId);
		}

		return Meetings.find({organizationId: { $in: orgIds}});
	});

	// Message subscription details
	Meteor.publish("messages", function(meetingId) {
		return Messages.find({meetingId: meetingId});
	});

  Meteor.publish("agendas", function(meetingId) {
		return Agendas.find({meetingId: meetingId});
	});

	// Message subscription details
	Meteor.publish("queues", function(meetingId) {
		return Queues.find({meetingId: meetingId});
	});

	// Message subscription details
	Meteor.publish("attendees", function() {
    var permissions = Permissions.find({ userId: this.userId }, { organizationId: 1, _id:0, userId: 0, userName: 0, role: 0 }).fetch();

		var orgIds = [];
		for(i = 0; i < permissions.length; i++) {
			orgIds.push(permissions[i].organizationId);
		}

		var meetings = Meetings.find({organizationId: { $in: orgIds}}).fetch();

		var meetingIds = [];
		for(i = 0; i < meetings.length; i++) {
			meetingIds.push(meetings[i]._id);
		}

		return Attendees.find({meetingId: { $in: meetingIds }});
	});

	// Vote subscription details
	Meteor.publish("votes", function(meetingId) {
		return Votes.find({meetingId: meetingId});
	});

}
