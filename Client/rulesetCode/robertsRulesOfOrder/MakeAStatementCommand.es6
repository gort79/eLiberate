if(Meteor.isClient) {

	MakeAStatementCommand = function() {
		return {
			constructor : function(meeting, organization, statement) {
				this.meeting = meeting;
				this.organization = organization;
				this.statement = statement;
			},

			actionName : function() {
				return "Make a Statement";
			},

			actionType : function() {
				return "MakeAStatement";
			},

			actionDisplayName : function() {
				return "A statement has been made";
			},
			
			execute : function() {
				if(this.validateAction()) {
					// Save the command
					messageId = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), actionType: this.actionType(), body: this.statement });
					
					if(messageId != "") 
					{
						var queue = Queues.findOne({ meetingId: Session.get("meetingId"), userId: Meteor.userId() });
						if(queue != null)
						{
							Queues.remove({ _id: queue._id });
						}
					}
					
					return messageId;
				}
			},
			
			validateAction : function() {
				// We have quorum and only a chairperson can call the meeting to order
				return true;  
			}
		};
	}
}