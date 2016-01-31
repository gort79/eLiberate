if(Meteor.isClient) {
	OpenFloorToDebateCommand = function() {

		this.commandName = "Open the Floor to Debate",
		this.commandType = "OpenFloorToDebate",
		this.commandDisplayName = "Opened the floor to debate",
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
			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				Meetings.update({_id: this.meeting._id}, {$set: {inDebate: true}});
			}
		},

		this.validateCommand = function() {
			if(Session.get("role") == ROLES.chairperson
				 && CurrentMotion() != undefined
				 && CurrentMotion().isDebateable
				 && !this.meeting.inDebate)
			{
				return true
			}
			return false;
		}
	}
}
