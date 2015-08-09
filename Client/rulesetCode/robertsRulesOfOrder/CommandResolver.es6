if(Meteor.isClient) {
	CommandResolver = {
		validCommands : function() {
			messages = Messages.find({meetingId: Session.get("meetingId")});
			meeting = Meetings.findOne({_id: Session.get("meetingId")});

			actions = [];
			
			if(messages.count() == 0
			   && Permissions.find({organizationId: meeting.organizationId, userId: Meteor.userId(), role: ROLES.chairperson}).count() > 0) {
				actions.push("Call the Meeting to Order");
			}

			actions.push("Make a Statement")
			return actions;
		},
		
		submitCommand : function() {
			meeting = Meetings.findOne({_id: Session.get("meetingId")});
			organization = Organizations.findOne({_id: meeting.organizationId});

			switch($('#actionSelected').text()) {
				case "Call the Meeting to Order":
					command = CallMeetingToOrderCommand();
					command.constructor(meeting, organization, $('#newMessage').val());
					console.log(command.execute());
					break;
				default:
					command = MakeAStatementCommand();
					command.constructor(meeting, organization, $('#newMessage').val());
					command.execute();
					break;
			}
		}
	}
}