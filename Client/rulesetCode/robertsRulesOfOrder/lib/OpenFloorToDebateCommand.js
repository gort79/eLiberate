if(Meteor.isClient) {
	OpenFloorToDebateCommand = function() {

		this.commandName = "Open the Floor to Discussion/Debate",
		this.commandType = "OpenFloorToDebate",
		this.commandDisplayName = "Opened the floor to discussion/debate",
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
		this.tooltip = 'Allows members of the meeting to debate the current motion once they have the floor.',

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: isValid, meetingPart: this.meetingPart, tooltip: this.tooltip});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				var currentMotion = CurrentMotion();
				if(currentMotion != undefined)
				{
					Messages.update({_id: currentMotion._id}, {$set: {status: MOTIONSTATUS.debate}});
				}
				else
				{
					Meetings.update({_id: Session.get("meetingId")}, {$set: {inDebate: true}});
				}
				Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement });
			}
		},

		this.validateCommand = function() {
			var currentMotion = CurrentMotion();
			if(currentMotion != undefined
					&& this.meeting.status == MEETINGSTATUS.started
					&& currentMotion.isDebateable
				 	&& currentMotion.status != MOTIONSTATUS.debate
				)
			{
				return true
			}
			else if(Session.get("role") == ROLES.chairperson
				&& this.meeting.status == MEETINGSTATUS.started
			  && currentMotion == undefined
				&& !this.meeting.inDebate)
			{
				return true;
			}

			return false;
		}
	}
}
