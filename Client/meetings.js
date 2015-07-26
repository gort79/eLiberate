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
			meetingClicked(this);
		}		 
	});

	Template.meetingSidebar.events({
		'click .meeting-button': function() {
			meetingClicked(this);
		}		 
	});

	function meetingClicked(args) {
		Session.set("meetingId", args._id);
		Session.set("ruleset", args.ruleset);
		Meteor.subscribe("messages", args._id);
		Meteor.subscribe("queues", args._id);
		
		$('#head').hide();
		$('footer').hide();
		$('#messagesContainer').show();
	}
	
	Template.meetingControls.helpers({
	  allRulesets: function() {
		return RULESETS.all();
	  }
	});

	Template.meetingControls.events({
		'click #newMeetingSubmit': function() {
			Meetings.insert({name: $('#newMeetingName').val(), dateTime: new Date($('#newMeetingDate').val() + ' ' + $('#newMeetingTime').val()), organizationId: Session.get("organizationId"), ruleset: $('#ruleset').val()});
		},
	  
		'click #rulesetDropdown ul li a': function() {
			$('#ruleset').val(this);
			$('#rulesetSelected').html(this);
		}
	});
	
	Template.meetingSidebar.helpers({
	  upcomingMeetings: function() {
		return Meetings.find({organizationId: Session.get("organizationId"), dateTime: {"$gte": new Date()}});
	  },
	  
	  meetingsExist: function() {
		return Meetings.find({organizationId: Session.get("organizationId"), dateTime: {"$gte": new Date()}}).count() > 0;
	  }
	});
	
}