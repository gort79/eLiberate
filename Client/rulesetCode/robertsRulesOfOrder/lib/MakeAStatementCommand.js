if(Meteor.isClient) {
	MakeAStatementCommand = function() {

		this.commandName = "Make a Statement",
		this.commandType = "MakeAStatement",
		this.commandDisplayName = "A statement has been made",
		this.canInterrupt = false,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 725,
		this.meetingPart = MEETINGPARTS.subsidiary,

		this.addCommandIfIsValid = function(commands) {
			if((this.meeting.status == MEETINGSTATUS.started)
					|| Session.get("role") == ROLES.chairperson) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				messageId = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });

				if(messageId != "")
				{
					var queue = Queues.findOne({ meetingId: Session.get("meetingId"), userId: Meteor.userId() });
					if(queue != null)
					{
						Queues.remove({ _id: queue._id });
					}
				}

				return messageId;
			}
		},

		this.validateCommand = function() {
			if(Session.get("role") == ROLES.chairperson
					|| this.meeting.isInDebate) {
				return true
			}
			return true;
		}
	}
}
