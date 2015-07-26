if(Meteor.isClient) {
	Template.messageTemplates.helpers ({
		meeting: function() {
			return Meetings.findOne({_id: Session.get("meetingId")});  	
		},
	  
		messages: function() {
			return Messages.find({ meetingId: Session.get("meetingId")});
		},
		
		rulesetMessages: function() {
			return toCamelCase(Session.get("ruleset")) + "Messages";
		},
		
		rulesetControls: function() {
			return toCamelCase(Session.get("ruleset")) + "Controls";
		}
	});
 }