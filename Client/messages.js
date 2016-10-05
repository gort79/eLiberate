if(Meteor.isClient) {
	Template.messageTemplates.helpers ({
		meeting: function() {
			return Meetings.findOne({_id: Session.get("meetingId")});
		},

		messages: function() {
			return Messages.find({ meetingId: Session.get("meetingId")});
		},

		rulesetHeader: function() {
			return toCamelCase(Session.get("ruleset")) + "Header";
		},

		rulesetTools: function() {
			return toCamelCase(Session.get("ruleset")) + "Tools";
		},

		rulesetMessages: function() {
			return toCamelCase(Session.get("ruleset")) + "Messages";
		},

		rulesetControls: function() {
			return toCamelCase(Session.get("ruleset")) + "Controls";
		},

		attendance: function() {
			return Attendees.find({meetingId: Session.get("meetingId")}).count();
		},

		quorum: function() {
			var meeting = Meetings.findOne({_id: Session.get("meetingId")});
			var attendanceCount = Attendees.find({meetingId: meeting._id}).count();
			var members = Permissions.find({organizationId: meeting.organizationId}).count();

			if(attendanceCount / members >= .5) {
				return "Quorum";
			} else {
				return "No Quorum";
			}
		}
	});
 }
