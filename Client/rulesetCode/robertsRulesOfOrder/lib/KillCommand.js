if(Meteor.isClient) {
	KillCommand = function() {

		this.commandName = "Kill the Current Motion",
		this.commandType = "Kill",
		this.commandDisplayName = "The chairperson has killed the motion",
		this.isDebateable = false,
		this.isDebateConfinedToPendingQuestion = false,
		this.isAmendable = false,
		this.canApplySubsidiaryMotions = false,
		this.canBeReconsidered = false,
		//this.voteType ... This is not set here because it is inherited by the motion under vote.
		this.requiresSecond = false,
		this.canInterrupt = false,
		this.isMotion = false,
		this.closesMotion = true,
		this.orderOfPresedence = 0,
		this.refreshCommands = true,
		this.meetingPart = MEETINGPARTS.administrative,
		this.motionPutToVote = undefined,
		this.refreshCommands = true,
		this.tooltip = 'Allows the chairperson to kill the current motion to keep the meeting moving properly.',

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: isValid, meetingPart: this.meetingPart, meetingPart: this.meetingPart, meetingPart: this.meetingPart, tooltip: this.tooltip});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Get the motion killed
				var motionToKill =  CurrentMotion();

				// Record that the chairperson put the motion to vote.
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, aye: 0, nay: 0, abstain: 0});
				Messages.update({_id: motionToKill._id}, {$set: {status: MOTIONSTATUS.killed}});
			}
		},

		this.validateCommand = function() {
			if(CurrentMotion() != undefined)
			{
				return true;
			}
			return false;
		}
	}
}
