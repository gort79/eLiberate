if(Meteor.isClient) {
	Template.talkingStickMessages.helpers({
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


	Template.talkingStickControls.helpers({
	  queue: function() {
		return Queues.find({});
	  },

	  isYourTurn: function() {
		var queue = Queues.find({}).fetch();

		if(queue.length > 0) {
			if(queue[0].userId == Meteor.userId())
			{
				return true;
			}
		}
		
		return false; 
	  }
	});


	Template.talkingStickControls.events({
	  'click #newMessageSubmit': function() {
		messageId = Messages.insert({body: $('#newMessage').val(), dateTime: new Date(), meetingId: Session.get("meetingId"), userId: Meteor.userId(), userName: Meteor.user().username});
		if(messageId != "") 
		{
			var queue = Queues.findOne({ meetingId: Session.get("meetingId"), userId: Meteor.userId() });
			if(queue != null)
			{
				Queues.remove({ _id: queue._id });
			}
		}
	  },

	  'click #enterQueue': function() {
		Queues.insert({meetingId: Session.get("meetingId"), userId: Meteor.userId(), userName: Meteor.user().username});
	  }
	});
}