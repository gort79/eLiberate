if(Meteor.isClient) {
	CommitToCommitteeCommand = function() {

		this.commandName = "Commit to Committee",
		this.commandType = "CommitToCommittee",
		this.commandDisplayName = "Member moves to refer the motion to a committee",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 900,
		this.meetingPart = MEETINGPARTS.subsidiary,
		this.tooltip = 'Appoint the current motion to a group to research/discuss/debate the subject outside of the meeting. The group only has the power appointed to it.',

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
			if(this.meeting.status == MEETINGSTATUS.started
				 && CurrentMotion() != undefined) {
				return true
			}
			return false;
		}
	}
}
