if(Meteor.isClient) {
	/* eLiberate Constants */
	Template.robertsRulesOfOrderMessages.helpers({
		meetingId: function() {
			return Session.get("meetingId") || 0;
		},
	
		meetingMessages: function() {
			return Messages.find({meetingId: Session.get("meetingId")});
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
		
		actions: function() {
			return CommandResolver.validCommands(); 
		}
	});


	Template.robertsRulesOfOrderControls.events({
		'click #newMessageSubmit': function() {
			CommandResolver.submitCommand();
		},
	  	
		'click #actionDropdown ul li a': function() {
			$('#action').val(this);
			$('#actionSelected').html(this);
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