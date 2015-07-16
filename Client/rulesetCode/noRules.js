if(Meteor.isClient) {
	Template.noRulesMessages.helpers({
	  meetingId: function() {
		return Session.get("meetingId") || 0;
	  },

	  meetingMessages: function() {
		return Messages.find({meetingId: Session.get("meetingId")});
	  }
	});

	Template.noRulesControls.events({
	  'click #newMessageSubmit': function() {
		Messages.insert({body: $('#newMessage').val(), dateTime: new Date(), meetingId: Session.get("meetingId"), userId: Meteor.userId(), userName: Meteor.user().username});
	  }
	});
}