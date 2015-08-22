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
			joinMeeting(this);
		},
		'click #editMeeting': function() {
			Session.set("meetingId", this._id);
			$('#editMeetingControlsContainer').toggle();
		}

	});

	Template.meetingEditor.helpers({
		agenda: function() {
			return Agendas.find({meetingId: Session.get("meetingId")});
		},
	});

	Template.meetingEditor.events({
		'click #addAgendaItem': function() {
			Agendas.insert({name: $('#agendaContent').val(), meetingId: Session.get("meetingId"), ordinal: Agendas.find({meetingId: Session.get("meetingId")}).count(), status: AGENDASTATUS.pending});
		}
	});

	Template.meetingSidebar.events({
		'click .meeting-button': function() {
			joinMeeting(this);
		},

	});

	function joinMeeting(meeting) {
		// Pull them out of the previous meeting if they were in one
		Meteor.call('leaveMeeting', Meteor.userId(), Session.get("organizationId"), Session.get("meetingId"));

		// Log the user into the meeting
		Session.set("meetingId", meeting._id);
		Session.set("ruleset", meeting.ruleset);
		Meteor.subscribe("messages", meeting._id);
		Meteor.subscribe("queues", meeting._id);
		Meteor.subscribe("attendees", meeting._id);
		Meteor.subscribe("agendas", meeting._id);

		// Increment the number logged into the meeting
		Meteor.call('joinMeeting', Meteor.userId(), meeting.organizationId, meeting._id);

		$('#head').hide();
		$('footer').hide();
		$('#messagesContainer').show();

		// Trigger our custom event
		$(document).trigger("joinedMeeting");
	}

	// Global function because it's used in the signout event
	leaveMeeting = function(userId, organizationId, meetingId) {
		if(Session.get("meetingId") != undefined) {
			Meteor.call('leaveMeeting', userId, organizationId, meetingId);
			delete Session.keys.meetingId;

			$('#head').show();
			$('footer').show();
			$('#messagesContainer').hide();
		}
	}

	Template.meetingControls.helpers({
		allRulesets: function() {
			return RULESETS.all();
		}
	});

	Template.meetingControls.events({
		'click #newMeetingSubmit': function() {
			Meetings.insert({name: $('#newMeetingName').val(), startDateTime: new Date($('#newMeetingStartDate').val() + ' ' + $('#newMeetingStartTime').val()), endDateTime: new Date($('#newMeetingEndDate').val() + ' ' + $('#newMeetingEndTime').val()), organizationId: Session.get("organizationId"), ruleset: $('#ruleset').val(), status: MEETINGSTATUS.pending, isInDebate: false});
		},

		'click #rulesetDropdown ul li a': function() {
			$('#ruleset').val(this);
			$('#rulesetSelected').html(this);
		}
	});

	Template.meetingSidebar.helpers({
		activeAndUpcomingMeetings: function() {
			return Meetings.find({$or: [{ startDateTime: {"$gte": new Date()}}, { status: MEETINGSTATUS.pending}]}, { sort: { startDateTime: 1 }});
		},

		meetingsExist: function() {
			return Meetings.find({$or: [{ startDateTime: {"$gte": new Date()}}, { status: MEETINGSTATUS.pending}]}).count() > 0;
		},

		attendance: function() {
			return Attendees.find({meetingId: this._id}).count();
		}
	});

}
