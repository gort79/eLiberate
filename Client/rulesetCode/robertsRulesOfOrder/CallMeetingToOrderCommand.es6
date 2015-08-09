if(Meteor.isClient) {
	CallMeetingToOrderCommand = function() {
		return {
			constructor : function(meeting, organization, openingComment) {
				this.meeting = meeting;
				this.organization = organization;
				this.openingComment = openingComment;
			},

			actionName : function() {
				return "Call the Meeting to Order";
			},

			actionType : function() {
				return "CallMeetingToOrder";
			},

			actionDisplayName : function() {
				return "The meeting has been called to order";
			},
			
			execute : function() {
				if(this.validateAction()) {
					// Save the command
					messageId = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, actionType: this.actionType(), body: this.openingComment });
					
					if(messageId != "") 
					{
						var queue = Queues.findOne({ meetingId: Session.get("meetingId"), userId: Meteor.userId() });
						if(queue != null)
						{
							Queues.remove({ _id: queue._id });
						}
					}
					
					return meetingId;
				}
			},
			
			validateAction : function() {
				// We have quorum and only a chairperson can call the meeting to order
				return true;//Attendees.find({meetingId: this.meeting._id}).count() >= organization.quorum 
					   //&& Permissions.find({ organizationId: this.organization._id, userId: Meteor.userId(), role: ROLES.chairperson }).count() > 0;  
			}
		};
	}
}