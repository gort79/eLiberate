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
		this.tooltip = 'Comment on the current motion in play.',

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart, tooltip: this.tooltip});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });
			}
		},

		this.validateCommand = function() {
			var currentMotion = CurrentMotion();
			if(currentMotion != undefined
					&& this.meeting.status == MEETINGSTATUS.started
					&& currentMotion.isDebateable
					&& currentMotion.status == MOTIONSTATUS.debate
					|| Session.get("role") == ROLES.chairperson) {
				return true
			} else if(currentMotion == undefined
					&& this.meeting.status == MEETINGSTATUS.started
				  && this.meeting.inDebate == true) {
				return true;
			}

			return false;
		}
	}
}
