if(Meteor.isClient) {
	AmendCommand = function() {

		this.commandName = "Amend a Motion",
		this.commandType = "Amend",
		this.commandDisplayName = "Member moves to amend the motion",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = true,
		this.closesMotion = false,
		this.orderOfPresedence = 1000,
		this.meetingPart = MEETINGPARTS.subsidiary,

		this.addCommandIfIsValid = function(commands) {
			if(IsInMotion()
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
			if(Session.get("role") == ROLES.chairperson
					&& Meeting.isInDebate) {
				return true
			}
			return true;
		}
	}
}
