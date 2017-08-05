if(Meteor.isClient) {
	CloseFloorToDebateCommand = function() {

		this.commandName = "Close the Floor to Debate",
		this.commandType = "CloseFloorToDebate",
		this.commandDisplayName = "Closed the floor to discussion/debate",
		this.canInterrupt = false,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.administrative,
		this.refreshCommands = true,
		this.tooltip = "Ends the debate on the current motion.",

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: isValid, meetingPart: this.meetingPart, tooltip: this.tooltip});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				var currentMotion = CurrentMotion();
				if(currentMotion != undefined)
				{
					Messages.update({_id: currentMotion._id}, {$set: {status: MOTIONSTATUS.seconded}});
				}
				else
				{
					Meetings.update({_id: Session.get("meetingId")}, {$set: {inDebate: false}});
				}
				Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });
			}
		},

		this.validateCommand = function() {
			var currentMotion = CurrentMotion();
			if(Session.get("role") == ROLES.chairperson
				  && currentMotion != undefined
				  && currentMotion.status == MOTIONSTATUS.debate
				)
			{
				return true
			}
			else if(Session.get("role") == ROLES.chairperson
				&& currentMotion == undefined
				&& this.meeting.inDebate)
			{
				return true
			}
			return false;
		}
	}
}
