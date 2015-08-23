if(Meteor.isClient) {
	var options = {
		loop:true,
		margin:10,
		nav:true,
		autoWidth:true
	};

	var owl;

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
	  }
	});

	Template.organizations.rendered = function() {
		this.autorun(_.bind(function(){
			owl = $('#organization-list').owlCarousel(options)
			// this is how we "listen" for databases change : we setup a reactive computation
			// and inside we reference a cursor (query) from the database and register
			// dependencies on it by calling cursor.forEach, so whenever the documents found
			// by the cursor are modified on the server, the computation is rerun with
			// updated content, note that we use the SAME CURSOR that we fed our #each with
			var orgs = Organizations.find({});
			// forEach registers dependencies on the cursor content exactly like #each does
			orgs.forEach(function(org){});
			// finally we need to reinit the carousel so it take into account our newly added
			// HTML elements as carousel items, but we can only do that AFTER the #each block
			// has finished inserting in the DOM, this is why we have to use Deps.afterFlush
			// the #each block itself setup another computation and Deps.afterFlush makes sure
			// this computation is done before executing our callback

			Tracker.afterFlush(_.bind(function(){
				owl.trigger('refresh.owl.carousel', [300]);
			},this));
		},this));
	}

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
	  }
	});

	Template.organizations.events({
		'click #organization-link': function() {
			logIntoOrganization(this._id);

			$('#meetingControls').show();
			$('#meetingContent').show();
			$('#organization-details').slideDown();
		},
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

	Template.newOrganizationControls.events({
	  'click #newOrganizationSubmit': function() {
		organizationId = Organizations.insert({name: $("#newOrganizationName").val()});
		permissionId = Permissions.insert({organizationId: organizationId, userId: Meteor.userId(), userName: Meteor.user().username, role: ROLES.administrator});
	  }
	});

	Template.organizationDetails.events({
		'change .userRole': function() {
			Permissions.update({ _id: this._id },
							   { $set: {"role":  $("#" + this.userName + ".userRole ").val()}});
		},

		'click #editOrganizationSubmit': function() {
			Organizations.update({ _id: Session.get("organizationId") },
								 { $set: {"name": $("#editOrganizationName").val()}});
		},

		'click #inviteUserSubmit': function() {
			Meteor.call('findUserIdByEmail', $('#inviteUserEmail').val(), function(err, data) {
				if(data != null){
					if(Permissions.find({organizationId: Session.get("organizationId"), userId: data._id}).count() == 0) {
						Permissions.insert({organizationId: Session.get("organizationId"), userId: data._id, userName:data.username, role: $('#inviteUserRole').val() })
					} else {
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
