if(Meteor.isClient) {
	Template.messageTemplates.helpers ({
	  meeting: function() {
		return Meetings.findOne({_id: Session.get("meetingId")});  	
	  }
	});
 }