if(Meteor.isClient) {
	AmendCommand = function() {

		this.commandName = "Amend a Motion",
		this.commandType = "Amend",
		this.commandDisplayName = "Member moves to amend the motion",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = true,
		this.closesMotion = false,
		this.orderOfPresedence = 1000,
		this.meetingPart = MEETINGPARTS.subsidiary,
		this.tooltip = 'proposes an edit the current motion. Need 1: a 2nd 2: a majority vote. Can be debated/amended. Needs to be relevant.',

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

		this.selected = function(textbox, currentMotion) {
			textbox.val(currentMotion.statement);
		}

		this.validateCommand = function() {
			if(IsInMotion()
				 && this.meeting.status == MEETINGSTATUS.started)
				 {
					 return true;
				 }
			return false;
		}
	}
}
