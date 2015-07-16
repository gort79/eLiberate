if(Meteor.isClient) {
	Template.meetings.helpers({
	  meetings: function() {
		return Meetings.find({organizationId: Session.get("organizationId")});
	  },

	  organizationId: function() {
		return Session.get("organizationId");
	  }
	});

	Template.meetings.events({
	  'click #meetingId': function() {
		Session.set("meetingId", this._id);
		Meteor.subscribe("messages", this._id);
		Meteor.subscribe("queues", this._id);
		Blaze.render(Template.messageTemplates, $('#messagesContainer')[0]);
	  }
	});

	Template.meetingControls.helpers({
	  allRulesets: function() {
		return RULESETS.all();
	  }
	});

	Template.meetingControls.events({
	  'click #newMeetingSubmit': function() {
		Meetings.insert({name: $('#newMeetingName').val(), dateTime: new Date($('#newMeetingDate').val() + ' ' + $('#newMeetingTime').val()), organizationId: Session.get("organizationId"), ruleset: $('#ruleset').val()});
	  },

	  'click #editMeetings': function() {
		if($("#editMeetings").html() == "Edit") 
		{
		  $("#editMeetings").html("Close");
		  $("#meetingsContainer").animate({ height: "90%" },
			function() { $("#meetingControls").show() });
		  $("#meetings").animate({ bottom: "150px"});
		} 
		else 
		{
		  $("#editMeetings").html("Edit");
		  $("#meetingsContainer").animate({ height: "120px"});
		  $("#meetingControls").hide();
		  $("#meetings").animate({ bottom: "50px"});
		}
	  }  
	});
}