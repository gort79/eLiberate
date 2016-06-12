if(Meteor.isClient) {
	MainMotionCommand = function() {

		this.commandName = "Main Motion",
		this.commandType = "Motion",
		this.commandDisplayName = "Member moves",
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isDebateConfinedToPendingQuestion = true,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simpleMajority,
		this.requiresSecond = true,
		this.canInterrupt = false,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 1200,
		this.meetingPart = MEETINGPARTS.main,

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this.status = MOTIONSTATUS.second;
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, status: MOTIONSTATUS.second, aye: 0, nay: 0, abstain: 0 });
			}
		},

		this.validateCommand = function() {
			return this.meeting.status == MEETINGSTATUS.started && Agendas.findOne({meetingId: this.meeting._id, status: AGENDASTATUS.active}) != undefined;
		}
	}
}
