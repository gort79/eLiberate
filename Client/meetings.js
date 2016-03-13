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
			// Pull them out of the previous meeting if they were in one
			leaveMeeting(Meteor.userId(), this.organizationId, this._id);

			// Log the user into the meeting
			Session.set("meetingId", this._id);
			Session.set("ruleset", this.ruleset);

			// Increment the number logged into the meeting
			//Meteor.call('joinMeeting', Meteor.userId(), meeting.organizationId, meeting._id);
			if(Attendees.find({meetingId: this._id, userId: Meteor.userId()}).fetch() == 0)
			{
				Attendees.insert({meetingId: this._id, userId: Meteor.userId()});
			}

			$('#head').hide();
			$('footer').hide();

			// Trigger our custom event
			$(document).trigger("joinedMeeting");

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
			// Pull them out of the previous meeting if they were in one
			leaveMeeting(Meteor.userId(), this.organizationId, this._id);

			// Log the user into the meeting
			Session.set("meetingId", this._id);
			Session.set("ruleset", this.ruleset);

			// Increment the number logged into the meeting
			//Meteor.call('joinMeeting', Meteor.userId(), meeting.organizationId, meeting._id);
			if(Attendees.find({meetingId: this._id, userId: Meteor.userId()}).fetch() == 0)
			{
				Attendees.insert({meetingId: this._id, userId: Meteor.userId()});
			}

			$('#head').hide();
			$('footer').hide();

			// Trigger our custom event
			$(document).trigger("joinedMeeting");

			$('#menu-toggle').removeClass("bt-menu-open").addClass("bt-menu-close");
			$("#sidebar-wrapper").removeClass("active");
		},

	});


	// Global function because it's used in the signout event
	leaveMeeting = function(userId, organizationId, meetingId) {
		if(Session.get("meetingId") != undefined) {
			Meteor.call('leaveMeeting', userId, organizationId, meetingId);

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
			Meetings.insert({name: $('#newMeetingName').val(), startDateTime: new Date($('#newMeetingStartDate').val() + ' ' + $('#newMeetingStartTime').val()), endDateTime: new Date($('#newMeetingEndDate').val() + ' ' + $('#newMeetingEndTime').val()), organizationId: Session.get("organizationId"), ruleset: $('#ruleset').val(), status: MEETINGSTATUS.pending, inDebate: false});
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
