if(Meteor.isServer) {
	function allowOrganizationAdmin(userId, doc) { 
		// They can insert as long as they are an admin, chairpersion, or it's a new org
		if(Permissions.find({organizationId: doc.organizationId, userId: userId, $or: [{ role: ROLES.administrator}, {role: ROLES.chairperson}]}).count() > 0) {
		  return true;
		}
		// Or if there are no permissions
		else if (Permissions.find({organizationId: doc.organizationId}).count() == 0) {
		  return true
		}
		// Or if they are inserting their role based on an invite
		// They must be inserting the same role as in the invite
		else if(Invites.find({organizationId: doc.organizationId, userId: userId, role: doc.role}).count() > 0)
		{
		  return true;
		}

		return false;
	}
}