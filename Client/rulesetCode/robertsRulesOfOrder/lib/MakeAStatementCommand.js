if(Meteor.isClient) {
	MakeAStatementCommand = function() {

		this.commandName = "Make a Statement",
		this.commandType = "MakeAStatement",
		this.commandDisplayName = "A statement has been made",
		this.canInterrupt = false,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.subsidiary,

		this.addCommandIfIsValid = function(commands) {
			if((this.meeting.status == MEETINGSTATUS.started
						&& this.meeting.inDebate)
				 || Session.get("role") == ROLES.chairperson) {
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
					|| CurrentMotion.status == MOTIONSTATUS.debate) {
				return true
			}
			return true;
		}
	}
}