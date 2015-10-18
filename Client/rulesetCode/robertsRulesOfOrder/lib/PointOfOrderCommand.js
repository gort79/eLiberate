if(Meteor.isClient) {
	PointOfOrderCommand = function() {

		this.commandName = "Point of Order",
		this.commandType = "PointOfOrder",
		this.commandDisplayName = "Point of order",
		this.canInterrupt = true,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.incidental,

		this.addCommandIfIsValid = function(commands) {
			if(this.validateCommand()) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });
			}
		},

		this.validateCommand = function() {
			if(this.meeting.status == MEETINGSTATUS.started) {
				return true
			}
			return true;
		}
	}
}
