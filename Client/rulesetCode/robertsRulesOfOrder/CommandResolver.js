if(Meteor.isClient) {
	RobertsRulesOfOrderCommands = [];

	$(window).ready(function(){
		RobertsRulesOfOrderCommands.push(new AmendCommand());
		RobertsRulesOfOrderCommands.push(new CallTheMeetingToOrderCommand());
		RobertsRulesOfOrderCommands.push(new CommitToCommitteeCommand());
		RobertsRulesOfOrderCommands.push(new DivideTheQuestionCommand());
		RobertsRulesOfOrderCommands.push(new ExtendDebateCommand());
		RobertsRulesOfOrderCommands.push(new InformalConsiderationCommand());
		RobertsRulesOfOrderCommands.push(new LayOnTheTableCommand());
		RobertsRulesOfOrderCommands.push(new LimitDebateCommand());
		RobertsRulesOfOrderCommands.push(new MakeAStatementCommand());
		RobertsRulesOfOrderCommands.push(new MotionCommand());
		RobertsRulesOfOrderCommands.push(new ObjectToConsiderationCommand());
		RobertsRulesOfOrderCommands.push(new OpenAgendaItemCommand());
		RobertsRulesOfOrderCommands.push(new OrdersOfTheDayCommand());
		RobertsRulesOfOrderCommands.push(new PointOfInformationCommand());
		RobertsRulesOfOrderCommands.push(new PointOfOrderCommand());
		RobertsRulesOfOrderCommands.push(new PostponeIndefinitelyCommand());
		RobertsRulesOfOrderCommands.push(new PostponeToACertainTimeCommand());
		RobertsRulesOfOrderCommands.push(new PreviousQuestionCommand());
		RobertsRulesOfOrderCommands.push(new ReconsiderCommand());
		RobertsRulesOfOrderCommands.push(new SuspendTheRulesCommand());
		RobertsRulesOfOrderCommands.push(new TakeFromTheTableCommand());
		RobertsRulesOfOrderCommands.push(new WithdrawModifyMotionCommand());
	});

	GetCommandPrototype = function(commandType) {
		for(var index = 0; index < RobertsRulesOfOrderCommands.length; index++)
		{
			if(RobertsRulesOfOrderCommands[index].commandType == commandType)
			{
				return RobertsRulesOfOrderCommands[index]
			}
		}
	}

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
					SubmittedCommands.push(command);
					break;
				}
			}
		}
	}
}
