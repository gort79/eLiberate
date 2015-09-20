if(Meteor.isClient) {
	InformalConsiderationCommand = function() {

		this.commandName = "Open the Floor to Debate",
		this.commandType = "InformalConsideration",
		this.commandDisplayName = "Member moves to open the floor for informal consideration",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = false,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simplemajority,
		this.isMotion = false,
		this.closesMotion = true,
		this.orderOfPresedence = 750,
		this.meetingPart = MEETINGPARTS.subsidiary,

		this.addCommandIfIsValid = function(commands) {
			if(Session.get("role") == ROLES.chairperson
			 	 && this.meeting.status == MEETINGSTATUS.started) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });

				Meetings.update({_id: this.meeting._id}, {$set: {inDebate: true}});
			}
		},

		this.validateCommand = function() {
			if(Session.get("role") == ROLES.chairperson) {
				return true
			}
			return false;
		}
	}
}
