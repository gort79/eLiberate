if(Meteor.isClient) {
	PointOfInformationCommand = function() {

		this.commandName = "Point of Information",
		this.commandType = "PointOfInformation",
		this.commandDisplayName = "Point of information",
		this.canInterrupt = true,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.incidental,

		this.addCommandIfIsValid = function(commands) {
			if(this.meeting.status == MEETINGSTATUS.started) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });
			}
		},

		this.validateCommand = function() {
			if(Session.get("role") == ROLES.chairperson
					&& Meeting.isInDebate) {
				return true
			}
			return true;
		}
	}
}