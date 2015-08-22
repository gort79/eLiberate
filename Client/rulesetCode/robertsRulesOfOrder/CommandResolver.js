if(Meteor.isClient) {
	RobertsRulesOfOrderCommands = [];

	$(window).ready(function(){
		RobertsRulesOfOrderCommands.push(new CallTheMeetingToOrderCommand());
		RobertsRulesOfOrderCommands.push(new OpenTheFloorToDebateCommand());
		RobertsRulesOfOrderCommands.push(new MakeAStatementCommand());
	});

	CommandResolver = {
		visitValidCommands : function() {
			meeting = Meetings.findOne({_id: Session.get("meetingId")});
			organization = Organizations.findOne({_id: meeting.organizationId});

			var index
			commands = [];

			for(index = 0; index < RobertsRulesOfOrderCommands.length; index++)
			{
				CreateCommandInstance(RobertsRulesOfOrderCommands[index], meeting, organization, '', '', '').addCommandIfIsValid(commands);
			}

			return commands;
		},

		submitCommand : function() {
			meeting = Meetings.findOne({_id: Session.get("meetingId")});
			organization = Organizations.findOne({_id: meeting.organizationId});
			statement = $('#newMessage').val();

			var index;
			for(index = 0; index < RobertsRulesOfOrderCommands.length; index++)
			{
				if(RobertsRulesOfOrderCommands[index].commandName == $('#commandSelected').text())
				{
					command = CreateCommandInstance(RobertsRulesOfOrderCommands[index], meeting, organization, statement);
					command.execute();
					activeCommands.push(command);
					break;
				}
			}
		}
	}
}
