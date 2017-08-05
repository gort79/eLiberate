if(Meteor.isClient) {
	RobertsRulesOfOrderCommands = [];
	AdministrativeCommands = [];
	PrivilegedCommands = [];
	SubsidiaryCommands = [];
	MainCommands = [];
	IncidentalCommands = [];
	RevisitCommands = [];
	AvailableCommands = new ReactiveArray()

	RobertsRulesOfOrderCommands = [];
	AdministrativeCommands = [];
	PrivilegedCommands = [];
	SubsidiaryCommands = [];
	MainCommands = [];
	IncidentalCommands = [];
	RevisitCommands = [];

	RobertsRulesOfOrderCommands.push(new AdjournTheMeetingCommand());
	RobertsRulesOfOrderCommands.push(new AmendCommand());
	RobertsRulesOfOrderCommands.push(new AppealDecisionOfTheChairCommand());
	RobertsRulesOfOrderCommands.push(new CallTheMeetingToOrderCommand());
	RobertsRulesOfOrderCommands.push(new CloseFloorToDebateCommand());
	RobertsRulesOfOrderCommands.push(new CommitToCommitteeCommand());
	//RobertsRulesOfOrderCommands.push(new DivideTheQuestionCommand());
	RobertsRulesOfOrderCommands.push(new ExtendDebateCommand());
	RobertsRulesOfOrderCommands.push(new InformalConsiderationCommand());
	RobertsRulesOfOrderCommands.push(new KillCommand());
	RobertsRulesOfOrderCommands.push(new LayOnTheTableCommand());
	RobertsRulesOfOrderCommands.push(new LimitDebateCommand());
	RobertsRulesOfOrderCommands.push(new MakeAStatementCommand());
	RobertsRulesOfOrderCommands.push(new MainMotionCommand());
	RobertsRulesOfOrderCommands.push(new ObjectToConsiderationCommand());
	RobertsRulesOfOrderCommands.push(new OpenAgendaItemCommand());
	RobertsRulesOfOrderCommands.push(new OpenFloorToDebateCommand());
	//RobertsRulesOfOrderCommands.push(new OrdersOfTheDayCommand());
	//RobertsRulesOfOrderCommands.push(new PointOfInformationCommand());
	//RobertsRulesOfOrderCommands.push(new PointOfOrderCommand());
	RobertsRulesOfOrderCommands.push(new PostponeIndefinitelyCommand());
	//RobertsRulesOfOrderCommands.push(new PostponeToACertainTimeCommand());
	//RobertsRulesOfOrderCommands.push(new PreviousQuestionCommand());
	RobertsRulesOfOrderCommands.push(new PutToVoteCommand());
	RobertsRulesOfOrderCommands.push(new ReconsiderCommand());
	//RobertsRulesOfOrderCommands.push(new SuspendTheRulesCommand());
	RobertsRulesOfOrderCommands.push(new TakeFromTheTableCommand());
	RobertsRulesOfOrderCommands.push(new WithdrawModifyMainMotionCommand());

	for(var index = 0 ; index < RobertsRulesOfOrderCommands.length; index++)
	{
		switch(RobertsRulesOfOrderCommands[index].meetingPart)
		{
			case MEETINGPARTS.administrative:
				AdministrativeCommands.push(RobertsRulesOfOrderCommands[index]);
				break;
			case MEETINGPARTS.privileged:
				PrivilegedCommands.push(RobertsRulesOfOrderCommands[index]);
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

	// Methods now...

	GetCommandPrototype = function(commandType) {
		for(var index = 0; index < RobertsRulesOfOrderCommands.length; index++)
		{
			if(RobertsRulesOfOrderCommands[index].commandType == commandType
					|| RobertsRulesOfOrderCommands[index].commandName == commandType )
			{
				return RobertsRulesOfOrderCommands[index];
			}
		}
	}

	GetMotionTypes = function() {
		var motionTypes = [];
		for(var index = 0; index < RobertsRulesOfOrderCommands.length; index++)
		{
			if(RobertsRulesOfOrderCommands[index].isMotion)
			{
				motionTypes.push(RobertsRulesOfOrderCommands[index].commandType);
			}
		}

		return motionTypes;
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
						CreateCommandInstance(AdministrativeCommands[x], meeting, organization, '', '', '', '', undefined).addCommandIfIsValid(commands, CurrentOrderOfPresedence());
					}
				}

				if(meeting.status == MEETINGSTATUS.started)
				{
					for(var x = 0; x < PrivilegedCommands.length; x++)
					{
						CreateCommandInstance(PrivilegedCommands[x], meeting, organization, '', '', '', '', undefined).addCommandIfIsValid(commands, CurrentOrderOfPresedence());
					}

					for(var x = 0; x < SubsidiaryCommands.length; x++)
					{
						CreateCommandInstance(SubsidiaryCommands[x], meeting, organization, '', '', '', '', undefined).addCommandIfIsValid(commands, CurrentOrderOfPresedence());
					}

					for(var x = 0; x < MainCommands.length; x++)
					{
						CreateCommandInstance(MainCommands[x], meeting, organization, '', '', '', '', undefined).addCommandIfIsValid(commands, CurrentOrderOfPresedence());
					}

					for(var x = 0; x < IncidentalCommands.length; x++)
					{
						CreateCommandInstance(IncidentalCommands[x], meeting, organization, '', '', '', '', undefined).addCommandIfIsValid(commands, CurrentOrderOfPresedence());
					}

					if(Agendas.find({$or: [{status: AGENDASTATUS.pending}, {status: AGENDASTATUS.active}]}).count() == 0)
					{
						CreateCommandInstance(RevisitCommands[x], meeting, organization, '', '', '', '', undefined).addCommandIfIsValid(commands, CurrentOrderOfPresedence());
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
					command = CreateCommandInstance(RobertsRulesOfOrderCommands[index], meeting, organization, statement, Meteor.userId(), Meteor.user().username, new Date());
					isSubmittedCommandsPopulated.set(false);
					command.execute();
					if(command.refreshCommands)
					{
						BuildSubmittedCommands();
					}
					else
					{
						SubmittedCommands.push(command);
					}
					isSubmittedCommandsPopulated.set(true);
					break;
				}
			}
		}
	}
}
