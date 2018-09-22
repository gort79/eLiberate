if(Meteor.isServer) {
	Meteor.startup(function () {
	smtp = {
	  username: 'AKIAIBLUD2MS47XH2QXA',   // eg: server@gentlenode.com
	  password: 'At4eLUQMu43HDMr5jEo7cBP1f2ZvRfLHurrkJalrVlNc',   // eg: 3eeP1gtizk5eziohfervU
	  server:   'email-smtp.us-west-2.amazonaws.com',  // eg: mail.gandi.net
	  port: 587
	}

	process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
	});

	admins = ['gort79', 'douglas'];
}
