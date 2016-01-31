if(Meteor.isClient) {
	PutToVoteCommand = function() {

		this.commandName = "Put the Question to Vote",
		this.commandType = "PutToVote",
		this.commandDisplayName = "The chairperson has put the question to vote",
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

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart, meetingPart: this.meetingPart, meetingPart: this.meetingPart});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Get the motion put to vote
				motionPutToVote =  CurrentMotion();
				// Get the motion put to vote and link it to this guy so we can display it more easily on the screen
				this.motionPutToVote = motionPutToVote;
				this.voteType = motionPutToVote.voteType;
				this.aye = 0;
				this.nay = 0;
				this.abstain = 0;

				// Record that the chairperson put the motion to vote.
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, status: MOTIONSTATUS.toVote, motionIdPutToVote: motionPutToVote._id, aye: 0, nay: 0, abstain: 0});
			}
		},

		this.validateCommand = function() {
			if(CurrentMotion() != undefined)
			{
				return CurrentMotion().voteType != VOTETYPES.none && CurrentMotion().secondedBy != "";
			}
			return false;
		}
	}
}
