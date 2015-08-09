if(Meteor.isClient) {
	Template.profileTemplate.helpers({
		profile: function() {
			if(isLoggedIn()) {
				if(Meteor.user().profile == null)
				{
					var newProfile = {
						preferredColor: "#90EE90"
					};
					
					saveProfile(newProfile);
				}

				return Meteor.user().profile;
			}
			
			return null;
		}
	});
	
	Template.profileTemplate.events({
		"click #saveProfile": function() {
			var newProfile = {
				preferredColor: $("#preferredColor").val()
			};
			
			saveProfile(newProfile);
		}
	});
	
	function saveProfile(newProfile) {
			Meteor.users.update(Meteor.userId(), {$set: {profile: newProfile}});
	}
}