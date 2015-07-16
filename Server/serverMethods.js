if(Meteor.isServer) {
	Meteor.startup(function() {
	  Meteor.methods({
		// Organization is admin check
		isOrganizationAdmin: function(organizationId, userId) {
		  if(Permissions.find({organizationId: organizationId, userId: userId, $or: [ { role: ROLES.administrator }, { role: ROLES.chairperson} ] }).count() > 0) 
		  {
			return true;
		  }

		  return false;
		},

		findUserIdByEmail: function(address) {
			user = Meteor.users.find({emails: { $elemMatch: { address: address}}}, {_id: true, userName: true}).fetch();
			if(user.length > 0)
			{
				return user[0];
			}

			return null;
		}
	  })
	});
}