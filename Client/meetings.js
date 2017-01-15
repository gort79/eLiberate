if(Meteor.isClient) {

		ShowDefaultMeetingAdminControls = function(id) {
			$('tr[org-id="' + id + '"] #meeting-name-edit').show();
			$('tr[org-id="' + id + '"] #meeting-name-save').hide();
			$('tr[org-id="' + id + '"] #meeting-name-delete').hide();
			$('tr[org-id="' + id + '"] #meeting-name-cancel').hide();
			$('tr[org-id="' + id + '"] #meeting-name-edit').show();
			$('tr[org-id="' + id + '"] #meeting-name-save').hide();
			$('tr[org-id="' + id + '"] #meeting-name-delete').hide();
			$('tr[org-id="' + id + '"] #meeting-name-cancel').hide();
			$('tr[org-id="' + id + '"] #meetingId').show();
			$('tr[org-id="' + id + '"] #meeting-start-date').hide();
			$('tr[org-id="' + id + '"] #meeting-start-time').hide();
			$('tr[org-id="' + id + '"] #meeting-end-date').hide();
			$('tr[org-id="' + id + '"] #meeting-end-time').hide();
			$('tr[org-id="' + id + '"] #meeting-name-txt').hide();
		}

		ShowEditMeetingAdminControls = function(id) {
			$('tr[org-id="' + id + '"] #meeting-name-edit').hide();
			$('tr[org-id="' + id + '"] #meeting-name-save').show();
			$('tr[org-id="' + id + '"] #meeting-name-delete').show();
			$('tr[org-id="' + id + '"] #meeting-name-cancel').show();
			$('tr[org-id="' + id + '"] #meetingId').hide();
			$('tr[org-id="' + id + '"] #meeting-start-date').show();
			$('tr[org-id="' + id + '"] #meeting-start-time').show();
			$('tr[org-id="' + id + '"] #meeting-end-date').show();
			$('tr[org-id="' + id + '"] #meeting-end-time').show();
			$('tr[org-id="' + id + '"] #meeting-name-txt').show();

		}

		ValidateMeetingData = function(errorMessage) {
			if(errorMessage != "")
			{
				$('#meeting-validator-summary').show();
				$('#meeting-validator-summary').text(errorMessage);
			}
			else
			{
				$('#meeting-validator-summary').hide();
			}
		}

	Template.meetingsTemplates.helpers({
		meetings: function() {
			return Meetings.find({organizationId: Session.get("organizationId")}, {sort: {startDateTime: -1}});
		},

		organizationId: function() {
			return Session.get("organizationId");
		},

		agenda: function() {
			return Agendas.find({meetingId: this._id});
		},

		isAdmin: function () {
			return Permissions.find({$or: [ {userId: Meteor.userId(), role: ROLES.administrator }, {userId: Meteor.userId(), role: ROLES.chairperson} ] }).count() > 0;
		},

		allRulesets: function() {
			return RULESETS.all();
		}
	});

	Template.meetingsTemplates.events({
		'click #meetingId': function() {
			joinMeeting(this._id, this.organizationId, this.ruleset);
		},

		'click #editMeeting': function() {
			Session.set("meetingId", this._id);
		},

		'click #addAgendaItem': function(evt) {
			var item = $(evt.target).parent().find("#agendaContent").val();
			Agendas.insert({name: item, meetingId: this._id, ordinal: Agendas.find({meetingId: this._id}).count(), status: AGENDASTATUS.pending});
		},

		'click #newMeetingSubmit': function() {
			Meetings.insert({name: $('#newMeetingName').val(), startDateTime: new Date($('#newMeetingStartDate').val() + ' ' + $('#newMeetingStartTime').val()), endDateTime: new Date($('#newMeetingEndDate').val() + ' ' + $('#newMeetingEndTime').val()), organizationId: Session.get("organizationId"), ruleset: $('#newRuleset').val(), status: MEETINGSTATUS.pending, inDebate: false});
		},

		'click #rulesetDropdown ul li a': function() {
			$('#ruleset').val(this);
			$('#rulesetSelected').html(this);
		}
	});

	Template.meetingSidebar.helpers({
		meetingsExist: function() {
			return Meetings.find({$or: [{ startDateTime: {"$gte": new Date()}}, { status: MEETINGSTATUS.pending}]}).count() > 0;
		},

		activeAndUpcomingMeetings: function() {
			return Meetings.find({$or: [{ startDateTime: {"$gte": new Date()}}, { status: MEETINGSTATUS.pending }, { status: MEETINGSTATUS.started }]}, { sort: { startDateTime: 1 }});
		},

		attendance: function() {
			return Attendees.find({meetingId: this._id}).count();
		}
	});

	Template.meetingSidebar.events({
		'click .meeting-button': function() {
			joinMeeting(this._id, this.organizationId, this.ruleset);
		}	
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
}
