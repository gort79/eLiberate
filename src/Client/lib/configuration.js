if(Meteor.isClient) {
	accounts.ui.config({
		passwordsignupfields: 'username_and_email'
	});
}