if(Meteor.isClient) {

	ShowDefaultOrganizationAdminControls = function(id) {
		$('tr[org-id="' + id + '"] #organization-name-edit').show();
		$('tr[org-id="' + id + '"] #organization-name-save').hide();
		$('tr[org-id="' + id + '"] #organization-name-delete').hide();
		$('tr[org-id="' + id + '"] #organization-name-cancel').hide();
		$('tr[org-id="' + id + '"] #organization-name').show();
		$('tr[org-id="' + id + '"] #organization-name-txt').hide();
	}

	ShowEditOrganizationAdminControls = function(id) {
		$('tr[org-id="' + id + '"] #organization-name-edit').hide();
		$('tr[org-id="' + id + '"] #organization-name-save').show();
		$('tr[org-id="' + id + '"] #organization-name-delete').show();
		$('tr[org-id="' + id + '"] #organization-name-cancel').show();
		$('tr[org-id="' + id + '"] #organization-name').hide();
		$('tr[org-id="' + id + '"] #organization-name-txt').show();
	}

	ValidateOrganizationData = function(errorMessage) {
		if(errorMessage != "")
		{
			$('#organization-validator-summary').show();
			$('#organization-validator-summary').text(errorMessage);
		}
		else
		{
			$('#organization-validator-summary').hide();
		}
	}

	Template.organizations.helpers({
	  userOrganizations: function () {
			if(isLoggedIn())
			{
				Meteor.subscribe("organizations");
				var orgs =  Organizations.find({}).fetch();

				$('#organization-details').hide();

				if(orgs.length == 1)
				{
					organizationId = orgs[0]._id;
					Session.set("organizationId", organizationId);
					logIntoOrganization(organizationId);
				}

				return orgs;
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
	  },

		isAdmin: function () {
			return Meteor.wrapAsync(Meteor.call('isOrganizationAdmin', this._id, function(err, data) { return data; }));
		}
	});


	Template.organizations.events({
		'click #newOrganizationSubmit': function() {
			organizationId = Organizations.insert({name: $("#newOrganizationName").val()});
			Permissions.insert({organizationId: organizationId, userId: Meteor.userId(), userName: Meteor.user().username, role: ROLES.administrator});
			Meteor.subscribe("organizations");
			$("#newOrganizationName").val("");
		},

		'click #organization-link': function() {
			logIntoOrganization(this._id);

			$('#meetingControls').show();
			$('#meetingContent').show();
			$('#organization-details').slideDown();
		},

		'click #organization-name-edit': function() {
			ShowEditOrganizationAdminControls(this._id);
		},

		'click #organization-name-save': function(evt) {
			var orgName = $(evt.target).parent().parent().find("#organization-name-txt").val()
			if(orgName != undefined && orgName != '')
			{
				ValidateOrganizationData("");

				Organizations.update({_id: this._id}, {$set: {name: orgName}});

				ShowDefaultOrganizationAdminControls(this._id);
			}
			else
			{
				ValidateOrganizationData("You must enter a name for the organization.");
			}
		},

		'click #organization-name-delete': function() {
			var result = confirm("Are you sure you want to delete " + this.organizationName + "? All meetings will be deleted as well.");
			if (result) {
				Organizations.remove({_id: this._id});

				// Delete all of meetings
				var meetings = Meetings.find({organizationId: this._id}).fetch();
				for(var i = 0; i < meetings.count(); i++)
				{
					Meetings.remove({_id: meetings[i]._id});
				}

				// Delete all of roles
				var roles = Roles.find({organizationId: this._id}).fetch();
				for(var i = 0; i < roles.count(); i++)
				{
					Roles.remove({_id: roles[i]._id});
				}
			}
		},

		'click #organization-name-cancel': function() {
			$('organization-name-txt').val(this.name);
			ShowDefaultOrganizationAdminControls(this._id);
		}
	});

	Template.organizationDetails.helpers({
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
	  },

		isAdmin: function () {
			return Permissions.find({$or: [ {userId: Meteor.userId(), role: ROLES.administrator }, {userId: Meteor.userId(), role: ROLES.chairperson} ] }).count() > 0;
		}
	});

	logIntoOrganization = function(organizationId) {
		Session.set("organizationId", organizationId);
		Meteor.subscribe("permissions", organizationId);
		Meteor.subscribe("invites", organizationId);

		var permission = Permissions.findOne({organizationId: organizationId, userId: Meteor.userId()});
		if(permission != undefined)
		{
			Session.set("role", Permissions.findOne({organizationId: organizationId, userId: Meteor.userId()}).role);
		}
	}

	Template.organizationDetails.events({
		'change .userRole': function() {
			var role = $("#" + this.userName + ".userRole ").val();
			if(role == ROLES.chairperson)
			{
					var existingChairperson = Permissions.findOne({role: ROLES.chairperson});
					if(existingChairperson != undefined)
					{
						Permissions.update({ _id: existingChairperson._id}, { $set: {role: ROLES.member }});
					}
			}
			Permissions.update({ _id: this._id }, { $set: {"role":  $("#" + this.userName + ".userRole ").val()}});
		},

		'click #invite-user-submit': function() {
			Meteor.call('findUserIdByEmail', $('#invite-user-email').val(), function(err, data) {
				if(data != null){
					if(Permissions.find({organizationId: Session.get("organizationId"), userId: data._id}).count() == 0) {
						Permissions.insert({organizationId: Session.get("organizationId"), userId: data._id, userName:data.username, role: $('#inviteUserRole').val() })
					} else {
						alert($('#invite-user-email').val() + " is already a member of your organization.");
					}
				}
				else if(Invites.find({organizationId: Session.get("organizationId"), email: $('#invite-user-email').val()}).count() == 0) {
					Invites.insert({organizationId: Session.get("organizationId"), email: $('#invite-user-email').val(), role: $('#inviteUserRole').val()});

					organization = Organizations.findOne({_id: Session.get("organizationId")});
					Meteor.call('inviteUser', $('#invite-user-email').val(), organization.name);
				}
			});
		},

		'click #member-invite-resend': function() {
			organization = Organizations.findOne({_id: Session.get("organizationId")}).fetch();
			Meteor.call('inviteUser', this.email, organization.name);
		}
	});
}
