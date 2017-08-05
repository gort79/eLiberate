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
		this.canInterrupt = false,
		this.isMotion = true,
		this.closesMotion = false,
		this.orderOfPresedence = 1200,
		this.meetingPart = MEETINGPARTS.main,
		this.tooltip = 'Propose a spacific action and start the groups consideration of the subject.',

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
			return this.meeting.status == MEETINGSTATUS.started && Agendas.findOne({meetingId: this.meeting._id, status: AGENDASTATUS.active}) != undefined;
		}
	}
}
