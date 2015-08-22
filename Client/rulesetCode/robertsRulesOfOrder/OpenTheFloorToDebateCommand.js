if(Meteor.isClient) {
	OpenTheFloorToDebateCommand = function() {

		this.commandName = "Open the Floor to Debate",
		this.commandType = "OpenTheFloorToDebate",
		this.commandDisplayName = "The floor has been open for debate",
		this.voteType = VOTETYPES.none,
		this.isDebateable = true,

		this.addCommandIfIsValid = function(commands) {
			if(Permissions.find({organizationId: this.meeting.organizationId, userId: Meteor.userId(), role: ROLES.chairperson}).count() > 0
			 	 && this.meeting.status == MEETINGSTATUS.started) {
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
			if(Permissions.find({userId: Meteor.userId(), organizationId: this.organization._id, role: ROLES.chairperson})) {
				return true
			}
			return false;
		}
	}
}
