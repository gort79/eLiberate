if(Meteor.isServer) {
	Meteor.startup(function () {
	smtp = {
	  username: 'nathan.clinton@gmail.com',   // eg: server@gentlenode.com
	  password: 'ozqkgdagpusemqwa',   // eg: 3eeP1gtizk5eziohfervU
	  server:   'smtp.gmail.com',  // eg: mail.gandi.net
	  port: 587
	}  

	process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
	});
}