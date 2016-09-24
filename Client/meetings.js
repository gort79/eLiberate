if(Meteor.isClient) {
	Template.meetings.helpers({
		meetings: function() {
			return Meetings.find({organizationId: Session.get("organizationId")}, {sort: {startDateTime: -1}});
		},

		organizationId: function() {
			return Session.get("organizationId");
		},

		agenda: function() {
			return Agendas.find({meetingId: this._id});
		}
	});

	Template.meetings.events({
		'click #meetingId': function() {
			joinMeeting(this._id, this.organizationId, this.ruleset);
		},

		'click #editMeeting': function() {
			Session.set("meetingId", this._id);
		},

		'click #addAgendaItem': function(evt) {
			var item = $(evt.target).parent().find("#agendaContent").val();
			Agendas.insert({name: item, meetingId: this._id, ordinal: Agendas.find({meetingId: this._id}).count(), status: AGENDASTATUS.pending});
		}
	});

	Template.meetingSidebar.events({
		'click .meeting-button': function() {
			joinMeeting(this._id, this.organizationId, this.ruleset);
		},

	});

	joinMeeting = function(meetingId, organizationId, ruleset) {
		// Pull them out of the previous meeting if they were in one
		leaveMeeting(Meteor.userId(), organizationId);

		// Log the user into the meeting
		Session.set("meetingId", meetingId);
		Session.set("ruleset", ruleset);

		// Increment the number logged into the meeting
		//Meteor.call('joinMeeting', Meteor.userId(), meeting.organizationId, meeting._id);
		if(Attendees.find({meetingId: meetingId, userId: Meteor.userId()}).fetch() == 0)
		{
			Attendees.insert({meetingId: meetingId, userId: Meteor.userId(), userName: Meteor.user().username});
		}

		$('#head').hide();
		$('footer').hide();

		Meteor.subscribe("permissions", organizationId, function() {
			Session.set("role", Permissions.findOne({organizationId: organizationId, userId: Meteor.userId()}).role);
		});



		$('#menu-toggle').removeClass("bt-menu-open").addClass("bt-menu-close");
		$("#sidebar-wrapper").removeClass("active");

		// Trigger our custom event
		$(document).trigger("joinedMeeting");
	}

	// Global function because it's used in the signout event
	leaveMeeting = function(userId, organizationId) {
		if(Session.get("meetingId") != undefined) {
			attendees = Attendees.find({userId: userId}).fetch();
			if(attendees.length > 0)
			{
				for(var i = 0; i < attendees.length; i++)
				{
					Attendees.remove({_id: attendees[i]._id});
				}
			}

			delete Session.keys.meetingId;

			$('#head').show();
			$('footer').show();
		}
	}

	Template.meetingControls.helpers({
		allRulesets: function() {
			return RULESETS.all();
		}
	});

	Template.meetingControls.events({
		'click #newMeetingSubmit': function() {
			Meetings.insert({name: $('#newMeetingName').val(), startDateTime: new Date($('#newMeetingStartDate').val() + ' ' + $('#newMeetingStartTime').val()), endDateTime: new Date($('#newMeetingEndDate').val() + ' ' + $('#newMeetingEndTime').val()), organizationId: Session.get("organizationId"), ruleset: $('#newRuleset').val(), status: MEETINGSTATUS.pending, inDebate: false});
		},

		'click #rulesetDropdown ul li a': function() {
			$('#ruleset').val(this);
			$('#rulesetSelected').html(this);
		}
	});

	Template.meetingSidebar.helpers({
		activeAndUpcomingMeetings: function() {
			return Meetings.find({$or: [{ startDateTime: {"$gte": new Date()}}, { status: MEETINGSTATUS.pending }, { status: MEETINGSTATUS.started }]}, { sort: { startDateTime: 1 }});
		},

		meetingsExist: function() {
			return Meetings.find({$or: [{ startDateTime: {"$gte": new Date()}}, { status: MEETINGSTATUS.pending}]}).count() > 0;
		},

		attendance: function() {
			return Attendees.find({meetingId: this._id}).count();
		}
	});

}
