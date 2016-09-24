if(Meteor.isClient) {
	Template.contactTemplate.events({
		'click #sendComment': function() {
			Meteor.call('sendEmail', $('#comment').val(), $('#commentFrom').val(), function(err, data) {
			  if(err == undefined) {
					$('#commentSuccess').delay(500).fadeIn('normal', function() {
						 $(this).delay(10000).fadeOut();
					});
				}
			});
		}
	});
 }
