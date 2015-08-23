if(Meteor.isClient) {
	DivideTheQuestionCommand = function() {

		this.commandName = "Divide the Question",
		this.commandType = "DivideTheQuestion",
		this.commandDisplayName = "Member moves to divide the question",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = false,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simplemajority,
		this.isMotion = false,
		this.closesMotion = true,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.incidental,

		this.addCommandIfIsValid = function(commands) {
			if(this.meeting.status == MEETINGSTATUS.started) {
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
					&& Meeting.isInDebate) {
				return true
			}
			return true;
		}
	}
}
