if(Meteor.isClient) {
	CallTheMeetingToOrderCommand = function() {

		this.commandName = "Call the Meeting to Order",
		this.commandType = "CallMeetingToOrder",
		this.commandDisplayName = "Chairperson has called the meeting to order",
		this.canInterrupt = false,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.administrative,

		this.addCommandIfIsValid = function(commands) {
			if(this.meeting.status == MEETINGSTATUS.pending
				 && Session.get("role") == ROLES.chairperson) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });

				// Update the status of the meeting
				Meetings.update({_id: this.meeting._id}, { $set: {status: MEETINGSTATUS.started}});
			}
		},

		this.validateCommand = function() {
			// We have quorum and only a chairperson can call the meeting to order
			return true;//Attendees.find({meetingId: this.meeting._id}).count() >= organization.quorum
				   //&& Permissions.find({ organizationId: this.organization._id, userId: Meteor.userId(), role: ROLES.chairperson }).count() > 0;
		}
	}
}
