if(Meteor.isClient) {
	CloseFloorToDebateCommand = function() {

		this.commandName = "Close the Floor to Debate",
		this.commandType = "CloseFloorToDebate",
		this.commandDisplayName = "Closed the floor to debate",
		this.canInterrupt = false,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.administrative,

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart, meetingPart: this.meetingPart, meetingPart: this.meetingPart});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				Meetings.update({_id: this.meeting._id}, {$set: {inDebate: false}});
			}
		},

		this.validateCommand = function() {
			if(Session.get("role") == ROLES.chairperson
				&& this.meeting.inDebate == true)
			{
				return true
			}
			return false;
		}
	}
}
