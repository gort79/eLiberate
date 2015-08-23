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
		this.commandPart = "Subsidiary",

		this.addCommandIfIsValid = function(commands) {
			if(GetLastCommand() != null && GetLastCommand().isDebateable && this.meeting.status == MEETINGSTATUS.started) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				messageId = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, body: this.statement });

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
			if(Permissions.find({userId: Meteor.userId(), organizationId: this.organization._id, role: ROLES.chairperson})
					&& Meeting.isInDebate) {
				return true
			}
			return true;
		}
	}
}
