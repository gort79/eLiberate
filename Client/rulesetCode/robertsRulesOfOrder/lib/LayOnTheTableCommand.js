if(Meteor.isClient) {
	LayOnTheTableCommand = function() {

		this.commandName = "Lay On the Table",
		this.commandType = "LayOnTheTable",
		this.commandDisplayName = "Member moves to lay the question on the table",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = false,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 500,
		this.meetingPart = MEETINGPARTS.subsidiary,
		this.tooltip = 'Present an urgent matter for an immediate decision. Need 1: should explain the reason for making the motion, 2: a 2nd, 3: majority vote.',

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart, tooltip: this.tooltip});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this.status = MOTIONSTATUS.second;
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, status: MOTIONSTATUS.second, aye: 0, nay: 0, abstain: 0 });
			}
		},

		this.validateCommand = function() {
			if(CurrentMotion() != undefined
					&& CurrentMotion().isDebateable) {
				return true
			}
			return false;
		}
	}
}
