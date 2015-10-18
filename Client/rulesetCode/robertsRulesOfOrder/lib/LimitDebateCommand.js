if(Meteor.isClient) {
	LimitDebateCommand = function() {

		this.commandName = "Limit Debate",
		this.commandType = "LimitDebate",
		this.commandDisplayName = "Member moves to limit debate",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.simplemajority,
		this.isMotion = false,
		this.closesMotion = true,
		this.orderOfPresedence = 700,
		this.meetingPart = MEETINGPARTS.subsidiary,

		this.addCommandIfIsValid = function(commands) {
			if(this.validateCommand()) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this.status = MOTIONSTATUS.second;
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, status: MOTIONSTATUS.second, aye: 0, nay: 0, abstain: 0 });
			}
		},

		this.approved = function() {
			Meetings.update({_id: this.meeting._id}, {$set: {inDebate: false}});
		},

		this.validateCommand = function() {
			if(this.meeting.status == MEETINGSTATUS.started
				&& this.meeting.inDebate == true) {
				return true
			}
			return true;
		}
	}
}
