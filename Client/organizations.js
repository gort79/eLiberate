if(Meteor.isClient) {
	Template.organizations.helpers({
	  userOrganization: function () {
		if(Meteor.user() != null)
		{
		  Meteor.subscribe('organizations');
		  return Organizations.find();
		}
	  },

	  isAdminAndCurrentOrganization: function (organizationId) {
		// Make sure we're talking the same organization. If not, the user is trying to hack the system
		if(organizationId == Session.get("organizationId"))
		{
		  if(Permissions.find({organizationId: organizationId, userId: Meteor.userId(), $or: [ { role: ROLES.administrator }, { role: ROLES.chairperson} ] }).count() > 0) 
		  {
			return true;
		  }       
		}

		return false;
	  }
	});

	Template.editOrganizationControls.helpers({
	  organization: function () {
		return Organizations.findOne({_id: Session.get("organizationId")});
	  },

	  permissions: function () {
		return Permissions.find({organizationId: Session.get("organizationId")});
	  },

	  invite:  function () {
		return Invites.find({organizationId: Session.get("organizationId")});
	  },

	  allRoles: function () {
		return ROLES.all();
	  },

	  isInRole: function (userRole, role) {
		return userRole == role;
	  }
	});

	Template.organizations.events({
	  'click .organizationLink': function() {
		Session.set("organizationId", this._id);
		Meteor.subscribe("meetings", this._id);
		Meteor.subscribe("permissions", this._id);
		Meteor.subscribe("invites", this._id);

		$('#meetingContent').show(); 
	  },

	  'click #editOrganization': function() {
		if($("#editOrganization").html() == "Edit") 
		{
		  $("#editOrganization").html("Close");
		  $("#organizationsContainer").animate({ height: "90%", visibility: "visible"},
			function() { 
			  $("#newOrganizationControls").show();
			  $("#editOrganizationControls").show();
			}
		  );
		} 
		else 
		{
		  hideOrganizationMenu();
		} 
	  }
	});

	function hideOrganizationMenu() {
	  $("#editOrganization").html("Edit");
	  $("#organizationsContainer").animate({ height: "120px"});
	  $("#editOrganizationControls").hide()
	}

	Template.newOrganizationControls.events({
	  'click #newOrganizationSubmit': function() {
		organizationId = Organizations.insert({name: $("#newOrganizationName").val()});
		Permissions.insert({organizationId: organizationId, userId: Meteor.userId(), userName: Meteor.user().username, role: ROLES.administrator});
	  }
	});

	Template.editOrganizationControls.events({
	  'change .userRole': function() {
		Permissions.update({ _id: this._id },
						   { $set: {"role":  $("#" + this.userName + ".userRole ").val()}});
	  },

	  'click #inviteUserSubmit': function() {
		Meteor.call('findUserIdByEmail', $('#inviteUserEmail').val(), function(err, data) {
		  if(data != null){
			if(Permissions.find({organizationId: Session.get("organizationId"), userId: data._id}).count() == 0)
			{
			  Permissions.insert({organizationId: Session.get("organizationId"), userId: data._id, userName:data.username, role: $('#inviteUserRole').val() })
			}
			else
			{
			  alert($('#inviteUserEmail').val() + " is already a member of your organization.");            
			}
		  }
		  else if(Invites.find({organizationId: Session.get("organizationId"), email: $('#inviteUserEmail').val()}).count() == 0) {
			Invites.insert({organizationId: Session.get("organizationId"), email: $('#inviteUserEmail').val(), role: $('#inviteUserRole').val()});

			organization = Organizations.find({_id: Session.get("organizationId")}).fetch();
			Meteor.call('inviteUser', $('#inviteUserEmail').val(), organization[0].name);
		  }
		});
	  }
	});
}