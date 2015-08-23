if(Meteor.isClient) {
	SubmittedCommands = [];

	// Subsequent motions rely on the qualities of the last motion.
	GetLastCommand = function() {
		LoadSubmittedCommands();
		return SubmittedCommands[SubmittedCommands.length - 1];
	}

	// Checks to see if the meeting is currently in a motion.
	// Certain commands can only be used if we are dealing with an open motion.
	IsInMotion = function() {
		var isInMotion = false;

		for(var index = 0; index < SubmittedCommands.length; index++)
		{
			if(!isInMotion && SubmittedCommands[index].isMotion) {
				isInMotion = true;
			}
			else if (IsInMotion && SubmittedCommands[index].closesMotion) {
				IsInMotion = false;
			}
		}

		return isInMotion
	}

	// Loads up the SubmittedCommands array when you join a meeting
	$(document).on("joinedMeeting", function() {
		SubmittedCommands = [];
		LoadSubmittedCommands();
	});

	LoadSubmittedCommands = function() {
		if(SubmittedCommands.length == 0
			 && Messages.find({meetingId: Session.get("meetingId")}).count() > 0)
		{
			meeting = Meetings.findOne({_id: Session.get("meetingId")});
			organization = Organizations.findOne({_id: meeting.organizationId});
			messagesSubmitted = Messages.find({meetingId: Session.get("meetingId")}).fetch();

			for(var index = 0; index < messagesSubmitted.length; index++)
			{
				commandPrototype = GetCommandPrototype(messagesSubmitted[index].commandType);
				SubmittedCommands.push(CreateCommandInstance(commandPrototype, meeting, organization, messagesSubmitted[index].statement, messagesSubmitted[index].userName, messagesSubmitted[index].dateTime));
			}
		}
	}

	/* eLiberate Constants */
	Template.robertsRulesOfOrderMessages.helpers({
		meetingId: function() {
			return Session.get("meetingId") || 0;
		},

		meetingMessages: function() {
			return SubmittedCommands;
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
					return "fa-hourglass-start";
				case AGENDASTATUS.active:
					return "fa-hourglass-half";
				case AGENDASTATUS.ended:
					return "fa-hourglass-end";
			}
		}
	});

	Template.robertsRulesOfOrderControls.helpers({
		queue: function() {
			return Queues.find({});
		},

		hasTheFloor: function() {
			var queue = Queues.find({}).fetch();

			if(queue.length > 0) {
				if(queue[0].userId == Meteor.userId())
				{
					return true;
				}
			}

			return false;
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
