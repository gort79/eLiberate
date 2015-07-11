if (Meteor.isServer) {
  
  // Organization subscription details
  Meteor.startup(function () {
    Meteor.publish("organizations", function() {
      return Organizations.find({members: { $elemMatch: { userId: this.userId }}});
    });

    Organizations.allow({
      'insert': function (userId,doc) {
        return true; 
      }
    });

    // Meeting subscription details
    Meteor.publish("meetings", function(organizationId) {
      return Meetings.find({organizationId: organizationId});
    });

    Meetings.allow({
      'insert': function (userId,doc) {
        if(Organizations.find({_id: doc.organizationId, members: { $elemMatch: { userId: userId, role: ROLES.administrator }}}).count() > 0) {
          return true;
        }
        return false; 
      },
      'update': function (userId,docs) {
        for(i = 0; i < docs.count(); i++) {
          if(Organizations.find({_id: docs[i].organizationId, members: { $elemMatch: { userId: userId, role: ROLES.administrator }}}).count() == 0) {
            return false;
          }
        }
        return true; 
      },
      'remove': function (userId,doc) {
        if(Organizations.find({_id: doc.organizationId, members: { $elemMatch: { userId: userId, role: ROLES.administrator }}}).count() > 0) {
          return true;
        }
        return false; 
      }    });

    // Message subscription details
    Meteor.publish("messages", function(meetingId) {
      return Messages.find({meetingId: this.meetingId});
    });

    Messages.allow({
      'insert': function (userId,doc) {
        if (Organizations.find({_id: doc.organizationId, members: {$elemMatch: { userId: userId }}}).count() == 0) {
          return true;
        }
        else if(Meetings.find({_id: doc.meetingId, $or: [ {floor: userId}, {floor: "open"}]}).count() > 0) {
          return true;
        }
        else if (Organizations.find({_id: doc.organizationId, members: {$elemMatch: { userId: userId, role: ROLES.chairperson }}}).count() > 0) {
          return true;
        }
        return true; 
      }
    });
  });
}
