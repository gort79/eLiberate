if(Meteor.isClient) {
	WithdrawModifyMotionCommand = function() {

		this.commandName = "Withdraw or Modify the Motion",
		this.commandType = "WithdrawModifyMotion",
		this.commandDisplayName = "Member moves to withdraw or modify the motion",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = false,
		this.voteType = VOTETYPES.simplemajority,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 0,
		this.commandPart = "Incidental",

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
