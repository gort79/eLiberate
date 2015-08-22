if(Meteor.isClient) {
	activeCommands = [];

	// Stuff to keep track of the meeting
	GetLastCommand = function() {
		if(activeCommands.length > 0)
		{
			return activeCommands[activeCommands.length - 1];
		}

		return null;
	};

	$(document).on("joinedMeeting", function() {
		activeCommands = [];
	});

	/* eLiberate Constants */
	Template.robertsRulesOfOrderMessages.helpers({
		meetingId: function() {
			return Session.get("meetingId") || 0;
		},

		meetingMessages: function() {
			if(activeCommands.length == 0)
			{
				var messages = Messages.find({meetingId: Session.get("meetingId")}, { $sort: { dateTime: 1 }}).fetch();

				if(messages.length > 0)
				{
					var meeting = Meetings.findOne({_id: Session.get("meetingId")});
					var organization = Organizations.findOne({_id: meeting.organizationId});

					for(var index = 0; index < messages.length; index++)
					{
						for(index = 0; index < RobertsRulesOfOrderCommands.length; index++)
						{
							if(RobertsRulesOfOrderCommands[index].commandType == messages[index].commandType)
							{

								activeCommands.push(CreateCommandInstance(RobertsRulesOfOrderCommands[index], meeting, organization, messages[index].body, messages[index].useName, messages[index].dateTime));
							}
						}
					}
				}
			}

			console.log(activeCommands);
			return activeCommands;
		},

		commandTemplate: function() {
			return this.commandType + "Command";
		},

		queue: function() {
			return Queues.find({meetingId: Session.get("meetingId")});
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
