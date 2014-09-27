Messages = new Meteor.Collection("messages");


if (Meteor.isClient) {
  Meteor.subscribe("meeting-messages");

  Template.messages.meetingId = function() {
    return Session.get("meetingId");
  };
  
  Template.messages.meetingMessages = function() {
    return Messages.find({meetingId: Session.get("meetingId")});
  };
  
  Template.messageControls.events({
    'click #newMessageSubmit': function() {
      Messages.insert({body: $('#newMessage').val(), dateTime: new Date(), meetingId: Session.get("meetingId"), userId: Meteor.user()._id, userName: Meteor.user().username});    }
  });
}  

if (Meteor.isServer) {
  Meteor.startup(function() {
    Meteor.publish("meeting-messages", function() {
      return Messages.find();
    });
  });
}
