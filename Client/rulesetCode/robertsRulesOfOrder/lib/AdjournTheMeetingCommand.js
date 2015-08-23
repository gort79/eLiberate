if(Meteor.isClient) {
	AdjournTheMeetingCommand = function() {

		this.commandName = "Adjourn the Meeting",
		this.commandType = "AdjournTheMeeting",
		this.commandDisplayName = "Member moves to adjourn",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 100,
		this.meetingPart = "Privileged",

		this.addCommandIfIsValid = function(commands) {
			if(Session.get("role") == ROLES.chairperson
			 	 && this.meeting.status == MEETINGSTATUS.started) {
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
			if(Session.get("role") == ROLES.chairperson) {
				return true
			}
			return false;
		}
	}
}
