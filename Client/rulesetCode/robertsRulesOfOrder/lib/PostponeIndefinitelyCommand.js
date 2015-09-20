if(Meteor.isClient) {
	PostponeIndefinitelyCommand = function() {

		this.commandName = "Postpone Indefinitely",
		this.commandType = "PostponeIndefinitely",
		this.commandDisplayName = "Member moves that the motion be postponed indefinitely",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = false,
		this.voteType = VOTETYPES.simplemajority,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 725,
		this.meetingPart = MEETINGPARTS.subsidiary,

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
