if(Meteor.isClient) {
	RobertsRulesOfOrderCommands = [];
	AdministrativeCommands = [];
	PrivilegeCommands = [];
	SubsidiaryCommands = [];
	MainCommands = [];
	IncidentalCommands = [];
	RevisitCommands = [];
	AvailableCommands = new ReactiveArray()

	RobertsRulesOfOrderCommands = [];
	AdministrativeCommands = [];
	PrivilegeCommands = [];
	SubsidiaryCommands = [];
	MainCommands = [];
	IncidentalCommands = [];
	RevisitCommands = [];

	RobertsRulesOfOrderCommands.push(new AdjournTheMeetingCommand());
	RobertsRulesOfOrderCommands.push(new AmendCommand());
	RobertsRulesOfOrderCommands.push(new AppealDecisionOfTheChairCommand());
	RobertsRulesOfOrderCommands.push(new CallTheMeetingToOrderCommand());
	RobertsRulesOfOrderCommands.push(new CommitToCommitteeCommand());
	RobertsRulesOfOrderCommands.push(new DivideTheQuestionCommand());
	RobertsRulesOfOrderCommands.push(new ExtendDebateCommand());
	RobertsRulesOfOrderCommands.push(new InformalConsiderationCommand());
	RobertsRulesOfOrderCommands.push(new LayOnTheTableCommand());
	RobertsRulesOfOrderCommands.push(new LimitDebateCommand());
	RobertsRulesOfOrderCommands.push(new MakeAStatementCommand());
	RobertsRulesOfOrderCommands.push(new MainMotion());
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
	RobertsRulesOfOrderCommands.push(new WithdrawModifyMainMotion());

	for(var index = 0 ; index < RobertsRulesOfOrderCommands.length; index++)
	{
		switch(RobertsRulesOfOrderCommands[index].meetingPart)
		{
			case MEETINGPARTS.administrative:
				AdministrativeCommands.push(RobertsRulesOfOrderCommands[index]);
				break;
			case MEETINGPARTS.privilege:
				PrivilegeCommands.push(RobertsRulesOfOrderCommands[index]);
				break;
			case MEETINGPARTS.subsidiary:
				SubsidiaryCommands.push(RobertsRulesOfOrderCommands[index]);
				break;
			case MEETINGPARTS.main:
				MainCommands.push(RobertsRulesOfOrderCommands[index]);
				break;
			case MEETINGPARTS.incidental:
				IncidentalCommands.push(RobertsRulesOfOrderCommands[index]);
				break;
			case MEETINGPARTS.revisit:
				RevisitCommands.push(RobertsRulesOfOrderCommands[index]);
				break;
		}
	}

	AdministrativeCommands.push(new MakeAStatementCommand()); // Had code the ability for the chairperson to make a statement at any time


	// Methods now...

	GetCommandPrototype = function(commandType) {
		for(var index = 0; index < RobertsRulesOfOrderCommands.length; index++)
		{
			if(RobertsRulesOfOrderCommands[index].commandType == commandType)
			{
				return RobertsRulesOfOrderCommands[index];
			}
		}
	}

	CommandResolver = {
		visitValidCommands : function() {
			if(Session.get("meetingId") != undefined)
			{
				meeting = Meetings.findOne({_id: Session.get("meetingId")});
				organization = Organizations.findOne({_id: meeting.organizationId});

				var index
				commands = [];

				if(Session.get("role") == ROLES.chairperson)
				{
					for(var x = 0; x < AdministrativeCommands.length; x++)
					{
						CreateCommandInstance(AdministrativeCommands[x], meeting, organization, '', '', '', undefined).addCommandIfIsValid(commands);
					}
				}
				else
				{
					if(meeting.status == MEETINGSTATUS.started)
					{
						for(var x = 0; x < PrivilegeCommands.length; x++)
						{
							if(PrivilegeCommands[x].orderOfPresedence < CurrentOrderOfPresedence())
							{
								CreateCommandInstance(PrivilegeCommands[x], meeting, organization, '', '', '', undefined).addCommandIfIsValid(commands);
							}
						}

						for(var x = 0; x < SubsidiaryCommands.length; x++)
						{
							if(SubsidiaryCommands[x].orderOfPresedence < CurrentOrderOfPresedence())
							{
								CreateCommandInstance(SubsidiaryCommands[x], meeting, organization, '', '', '', undefined).addCommandIfIsValid(commands);
							}
						}

						for(var x = 0; x < MainCommands.length; x++)
						{
							if(MainCommands[x].orderOfPresedence < CurrentOrderOfPresedence())
							{
								CreateCommandInstance(MainCommands[x], meeting, organization, '', '', '', undefined).addCommandIfIsValid(commands);
							}
						}

						for(var x = 0; x < IncidentalCommands.length; x++)
						{
							CreateCommandInstance(IncidentalCommands[x], meeting, organization, '', '', '', undefined).addCommandIfIsValid(commands);
						}

						if(Agendas.find({$or: [{status: AGENDASTATUS.pending}, {status: AGENDASTATUS.active}]}).count() == 0)
						{
							for(var x = 0; x < RevisitCommands.length; x++)
							{
								CreateCommandInstance(RevisitCommands[x], meeting, organization, '', '', '', undefined).addCommandIfIsValid(commands);
							}
						}
					}
				}

				return commands;
			}
		},

		submitCommand : function() {
			meeting = Meetings.findOne({_id: Session.get("meetingId")});
			organization = Organizations.findOne({_id: meeting.organizationId});
			statement = $('#newMessage').val();
			AvailableCommands.clear();

			var index;
			for(index = 0; index < RobertsRulesOfOrderCommands.length; index++)
			{
				if(RobertsRulesOfOrderCommands[index].commandName == $('#commandSelected').text())
				{
					command = CreateCommandInstance(RobertsRulesOfOrderCommands[index], meeting, organization, statement, Meteor.user().username, new Date());
					command.execute();
					SubmittedCommands.push(command);
					break;
				}
			}
		}
	}
}
