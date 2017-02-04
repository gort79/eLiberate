if(Meteor.isServer) {
	Organizations.allow({
	  'insert': function (userId, doc) {
			return true;
	  },

	  'update': function (userId, doc) {
			if(Permissions.find({organizationId: doc._id, userId: userId, $or: [{ role: ROLES.administrator }, { role: ROLES.chairperson }]}))
			{
			  return true;
			}

			return false;
		},

		'remove': function(userId, doc) {
			return isNewOrOrganizationAdmin(doc._id, userId);
		}
	});

	Permissions.allow({
	  'insert': function(userId, doc) {
			return true;
			//return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  },

	  'update': function(userId, doc) {
			return true;
			//if(isNewOrOrganizationAdmin(doc.organizationId, userId)){
			//  // If the role they're setting now ISN'T an admin level role, we need to make sure there's an admin somewhere
			//  // You can't have an org without an admin, otherwise no one will be able to make any changes to the org.
			//  if(doc.role != ROLES.administrator && doc.role != ROLES.chairperson) {
			//	// Check if there's a different person with an admin role
			//	if(Permissions.find({organizationId: doc.organizationId, userId: {$ne: doc.userId}, $or: [{ role: ROLES.administrator}, {role: ROLES.chairperson}]}).count() > 0) {
			//	  // There is!
			//	  return true;
			//	}

			//	// Nope, denied.  You need at least one admin
			//	return false;
			//  }
			//  else {
			//	// The update is to make someone and admin, so we're good
			//	return true;
			//  }
			//}

			//// They don't have authorization to edit permissions.
			//return false;
	  },

	  'remove': function(userId, doc) {
			return true;
			if(isNewOrOrganizationAdmin(doc.organizationId, userId)){
			  // Check if there's a different person with an admin role
			  if(Permissions.find({organizationId: doc.organizationId, userId: {$ne: doc.userId}, $or: [{ role: ROLES.administrator}, {role: ROLES.chairperson}]})) {
				// There is!
				return true;
			  }

			  // Nope! Denied.
			  return false;
			}

			// They don't have authorization to edit permissions.
			return false;
	  }
	});

	Invites.allow({
	  'insert': function(userId, doc) {
			return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  },

	  'update': function(userId, doc) {
			return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  },

	  'remove': function(userId, doc) {
			return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  }
	});

	Meetings.allow({
	  'insert': function (userId,doc) {
			return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  },
	  'update': function (userId,doc) {
			return true;
			//TODO: Fix the permissions for meetings
			//return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  },
	  'remove': function (userId,doc) {
			return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  }
	});

	Messages.allow({
	  'insert': function (userId,doc) {
			var meeting = Meetings.findOne({_id: doc.meetingId});

			if(meeting.ruleset == RULESETS.talkingStick)
			{
			  if (Queues.find({meetingId: meeting._id, userId: userId}).count() > 0 && Queues.find({meetingId: meeting._id}).fetch()[0].userId == userId) {
					return true;
			  }
			  else if (Organizations.find({_id: doc.organizationId, members: {$elemMatch: { userId: userId, role: ROLES.chairperson }}}).count() > 0) {
					return true;
			  }
			  return false;
			}
			else
			{
			  return true;
			}
	  },

		'update' : function (userId, doc) {
			return true;
		},

		'remove' : function (userId, doc) {
			return true;
		}
	});

	Attendees.allow({
		'insert': function (userId,doc) {
			// They have to be a member AND not already be in the meeting
			var meeting = Meetings.findOne({_id: doc.meetingId});
			var organization = Organizations.findOne({_id: meeting.organizationId});
			if(Permissions.find({organizationId: organization._id, userId: userId}).count() > 0
			   && Attendees.find({meetingId: doc.meetingId, userId: userId}).count() == 0)
			{
				return true;
			}

			return false
		},

		//todo: validate that is only the isTypeing field is updated.
		'update': function(userId, doc) {
			return true;
		},

		'remove': function(userId, doc) {
			if(Permissions.find({userId: userId}).count() > 0
				&& doc.userId == userId)
			{
				return true;
			}

			return false;
		}
	});

	Queues.allow({
	  'insert': function(userId, doc) {
			return true;
			//if(doc.motionId != undefined)
			//{
			//	if(Queues.find({meetingId: doc.meetingId, motionId: doc.motionId, userId: userId, hasSpoken: false}).count() == 0)
			//	{
			//	  return true;
			//	}

			//	return false;
			//}
			//else
			//{
			//	if(Queues.find({meetingId: doc.meetingId, userId: userId, hasSpoken: false}).count() == 0)
			//	{
			//	  return true;
			//	}

			//  return false;
			//}
	  },
	  'update': function(userId, doc) {
			return true;
	  },
	  'remove': function(userId, doc) {
			return true;
	  }
	});

	Agendas.allow({
		'insert': function (userId,doc) {
			return true;//isNewOrOrganizationAdmin(doc.organizationId, userId);
	  },
	  'update': function (userId,doc) {
			return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  },
	  'remove': function (userId,doc) {
			return isNewOrOrganizationAdmin(doc.organizationId, userId);
	  }
	});

	Votes.allow({
		'insert': function (userId,doc) {
			return Permissions.find({organizationId: doc.organizationId, userId: userId, $or: [{role: ROLES.chairperson}, {role: ROLES.member}, {role: ROLES.administrator}]});
	  },
		'remove': function (userId,doc) {
			return true;
		}
	});


	Comments.allow({
		'insert': function (userId,doc) {
			return true;
	  },
		'update': function (userId,doc) {
			return false;
	  },
		'remove': function (userId,doc) {
			var user = Meteor.users.findOne(this.userId);
	    if(admins.includes(user.username)) {
				return true;
			}
			else
			{
				return false;
			}
		}
	});

	function isNewOrOrganizationAdmin(organizationId, userId) {
	  if(Permissions.find({organizationId: organizationId, userId: userId, $or: [ { role: ROLES.administrator }, { role: ROLES.chairperson} ] }).count() > 0
		|| Permissions.find({organizationId: organizationId}).count() == 0)
	  {
		return true;
	  }

	  return false;
	};
}
