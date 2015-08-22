if(Meteor.isClient) {
	CallTheMeetingToOrderCommand = function() {

		this.commandName = "Call the Meeting to Order",
		this.commandType = "CallMeetingToOrder",
		this.commandDisplayName = "The meeting has been called to order",
		this.voteType = VOTETYPES.none,
		this.isDebateable = false,

		this.addCommandIfIsValid = function(commands) {
			if(activeCommands.length == 0
				 && Permissions.find({organizationId: this.meeting.organizationId, userId: Meteor.userId(), role: ROLES.chairperson}).count() > 0) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				messageId = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, body: this.statement });

				// Update the status of the meeting
				Meetings.update({_id: this.meeting._id}, { $set: {status: MEETINGSTATUS.started}});
				return messageId;
			}
		},

		this.validateCommand = function() {
			// We have quorum and only a chairperson can call the meeting to order
			return true;//Attendees.find({meetingId: this.meeting._id}).count() >= organization.quorum
				   //&& Permissions.find({ organizationId: this.organization._id, userId: Meteor.userId(), role: ROLES.chairperson }).count() > 0;
		}
	}
}
