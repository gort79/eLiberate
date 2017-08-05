if(Meteor.isClient) {
	AdjournTheMeetingCommand = function() {

		this.commandName = "Adjourn the Meeting",
		this.commandType = "AdjournTheMeeting",
		this.commandDisplayName = "Member moves to adjourn",
		this.isDebateable = false,
		this.isDebateConfinedToPendingQuestion = true,
		this.isAmendable = false,
		this.canApplySubsidiaryMotions = false,
		this.canBeReconsidered = false,
		this.voteType = VOTETYPES.simpleMajority,
		this.requiresSecond = true,
		this.canInterrupt = false,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 100,
		this.meetingPart = MEETINGPARTS.privileged,
		this.tooltip = 'Propose to end the meeting. Need 1: a 2nd 2: a majority vote.',

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart, tooltip: this.tooltip});
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this.status = MOTIONSTATUS.second;
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, status: MOTIONSTATUS.second, aye: 0, nay: 0, abstain: 0 });
			}
		},

		this.selected = function(textbox, currentMotion) {
			textbox.val('');
		},

		this.approved = function() {
			// This should probably be a server-side activity.
			// Also, we only want it to happen once, hence the meeting status check.
			// If we don't have this check, then ALL members would try to run the code and that's not good.
			if(this.meeting.status != MEETINGSTATUS.ended)
			{
				// Close the meeting
				Meetings.update({_id: this.meeting._id}, {$set: {status: MEETINGSTATUS.ended, endDateTime: new Date()}});

				// Close any parent motions that may be open
				//var parentMotion = CurrentParentMotion();
				//if(parentMotion != undefined)
				//{
				//	Messages.update({_id: parentMotion._id}, {status: MOTIONSTATUS.killed});
				//}
			}
		},

		this.validateCommand = function() {
			var currentMotion = CurrentMotion();
			//var openAgendas = Agendas.find({meetingId: this.meeting._id, status: AGENDASTATUS.active}).fetch();
			return this.meeting.status == MEETINGSTATUS.started
			  //&& openAgendas.length == 0
				&& (currentMotion == undefined
					|| (!currentMotion.isMotion
							|| (currentMotion.isMotion && currentMotion.status != MOTIONSTATUS.second)));
		}
	}
}
