if(Meteor.isClient) {
	SubmittedCommands = new ReactiveArray([]);

	// Subsequent motions rely on the qualities of the last motion.
	GetLastCommand = function() {
		LoadSubmittedCommands();
		return SubmittedCommands.list()[SubmittedCommands.length - 1];
	}

	// Checks to see if the meeting is currently in a motion.
	// Certain commands can only be used if we are dealing with an open motion.
	IsInMotion = function() {
		var isInMotion = false;

		for(var index = 0; index < SubmittedCommands.list().length; index++)
		{
			if(!isInMotion && SubmittedCommands.list()[index].isMotion) {
				isInMotion = true;
			}
			else if (IsInMotion && SubmittedCommands.list()[index].closesMotion) {
				IsInMotion = false;
			}
		}

		return isInMotion
	}

	CurrentOrderOfPresedence = function() {
		var currentMotion = CurrentMotion();
		var currentOrderOfPresedence = 0;

		if(currentMotion == undefined)
		{
			return 10000000;
		}

		return currentOrderOfPresedence.orderOfPresedence;
	}

	// Gets the current motion if you need it
	CurrentMotion = function() {
		var currentMotion;

		for(var index = 0; index < SubmittedCommands.list().length; index++)
		{
			if(!IsInMotion() && SubmittedCommands.list()[index].isMotion) {
				currentMotion = SubmittedCommands.list()[index];
			}
			else if (IsInMotion() && SubmittedCommands.list()[index].closesMotion) {
				currentMotion = undefined;
			}
		}

		return currentMotion;
	}

	HasTheFloor = function() {
		var queue = Queues.find({}).fetch();

		if(queue.length > 0) {
			if(queue[0].userId == Meteor.userId())
			{
				return true;
			}
		}

		return false;
	}

	// Loads up the SubmittedCommands array when you join a meeting
	$(document).on("joinedMeeting", function() {
		SubmittedCommands.clear();
	});

	LoadSubmittedCommands = function() {
		if(SubmittedCommands.list().length == 0
			 && Messages.find({meetingId: Session.get("meetingId")}).count() > 0)
		{
			meeting = Meetings.findOne({_id: Session.get("meetingId")});
			organization = Organizations.findOne({_id: meeting.organizationId});
			messagesSubmitted = Messages.find({meetingId: Session.get("meetingId")}).fetch();

			for(var index = 0; index < messagesSubmitted.length; index++)
			{
				commandPrototype = GetCommandPrototype(messagesSubmitted[index].commandType);
				SubmittedCommands.push(CreateCommandInstance(commandPrototype, meeting, organization, messagesSubmitted[index].statement, messagesSubmitted[index].userName, messagesSubmitted[index].dateTime, messagesSubmitted[index]));
			}
		}
	}

	/* eLiberate Constants */
	Template.robertsRulesOfOrderMessages.helpers({
		meetingId: function() {
			return Session.get("meetingId") || 0;
		},

		meetingMessages: function() {
			LoadSubmittedCommands();
			return SubmittedCommands.list();
		},

		queue: function() {
			return Queues.find({meetingId: Session.get("meetingId")});
		},

		agenda: function() {
			return Agendas.find({meetingId: Session.get("meetingId")});
		},

		statusIcon: function() {
			switch(this.status) {
				case AGENDASTATUS.pending:
					return "fa-square-o";
				case AGENDASTATUS.active:
					return "fa-star";
				case AGENDASTATUS.ended:
					return "fa-check-square-o";
			}
		},

		commandTemplate: function() {
			return this.commandType + "Command";
		},

		agendaOccurred: function() {
			if(this.status == AGENDASTATUS.ended
				 || this.status == AGENDASTATUS.active)
				 {
					 return true;
				 }
			return false;
		}
	});

	Template.robertsRulesOfOrderControls.helpers({
		queue: function() {
			return Queues.find({});
		},

		hasTheFloor: function() {
			return HasTheFloor();
		},

		allowToSubmit: function() {
			if(HasTheFloor()
				 || Session.get("role") == ROLES.chairperson)
			 {
				 	return "";
			 }

			 return "disabled";
		},

		attendingCount: function() {
			return Meetings.find({_id: Session.get("meetingId")}).fetch()[0].attendance;
		},

		commands: function() {
			return CommandResolver.visitValidCommands();
		}
	});


	Template.robertsRulesOfOrderControls.events({
		'click #newMessageSubmit': function() {
			CommandResolver.submitCommand();

			// Clear out the command controls
			$("#newMessage").val('');
			$("#commandSelected").val('Things you can do');
		},

		'click #commandDropdown ul li a': function() {
			$('#command').val(this);
			$('#commandSelected').html(this);
		},

		'click #messagePreviewButton': function() {
			Session.set("preview", $('#newMessage').val());
			showModal($("#messagePreviewButton"));
		},

		'click #enterQueue': function() {
			Queues.insert({meetingId: Session.get("meetingId"), userId: Meteor.userId(), userName: Meteor.user().username});
		}
	});
}
