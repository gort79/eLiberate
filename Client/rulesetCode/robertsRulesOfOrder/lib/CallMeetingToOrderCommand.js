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
		this.tooltip = "Begin the meeting. Need 1: a majority of people from the group to be present before you can start.",

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: isValid, meetingPart: this.meetingPart, meetingPart: this.meetingPart, meetingPart: this.meetingPart, tooltip: this.tooltip});
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
			var attendanceCount = Attendees.find({meetingId: this.meeting._id}).count();
			var members = Permissions.find({organizationId: meeting.organizationId}).count();

			if(this.meeting.status == MEETINGSTATUS.pending
				 && Session.get("role") == ROLES.chairperson
				 && attendanceCount / members >= .5
				 && this.meeting.startDateTime <= moment()
			 ) {

				return true;
			}
			return false;
		}
	}
}
