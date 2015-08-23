if(Meteor.isClient) {
		OrdersOfTheDayCommand = function() {

		this.commandName = "Order of the Day",
		this.commandType = "OrdersOfTheDay",
		this.commandDisplayName = "Member calls for the orders of the day",
		this.canInterrupt = true,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 400,
		this.meetingPart = "Privileged",

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
