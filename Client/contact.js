if(Meteor.isClient) {
	Template.contactTemplate.helpers({
		comments: function(){
			return Comments.find().fetch();
		},

		hasComments: function() {
			return Comments.find({}).count() > 0;
		}
	});
	Template.contactTemplate.events({
		'click #sendComment': function(e) {
			e.preventDefault();
			Comments.insert({commentFrom: $('#commentFrom').val(), comment: $('#comment').val()});
			Meteor.call('sendEmail', $('#comment').val(), $('#commentFrom').val(), function(err, data) {
			  if(err == undefined) {
					$('#commentSuccess').show('fade', {}, 500, function (){
						 $('#commentSuccess').delay(10000).hide('fade', {}, 500);
					});
				} else {
					$('#commentfailure').show('fade', {}, 500, function (){
						$('#commentFailureError').text(err);
						$('#commentSuccess').delay(10000).hide('fade', {}, 500);
					});
				}
			});
		}
	});
 }
