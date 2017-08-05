if(Meteor.isClient) {
	Template.noRulesMessages.onCreated(function () {
		this.subscribe("messages", Session.get("meetingId"));
	});

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
			Messages.insert({statement: $('#newMessage').val(), dateTime: new Date(), meetingId: Session.get("meetingId"), userId: Meteor.userId(), userName: Meteor.user().username, backgroundColor: Meteor.user().profile.preferredColor});
		},

	  'click #messagePreviewButton': function() {
			Session.set("preview", $('#newMessage').val());
			showModal($("#messagePreviewButton"));
		}
	});
}
