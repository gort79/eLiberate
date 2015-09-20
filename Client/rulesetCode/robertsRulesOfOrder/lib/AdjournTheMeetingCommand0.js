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

		this.addCommandIfIsValid = function(commands) {
			if(this.meeting.status == MEETINGSTATUS.started) {
				commands.push(this.commandName);
			}
		},

		this.execute = function() {
			if(this.validateCommand()) {
				// Save the command
				this.status = MOTIONSTATUS.second;
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, status: MOTIONSTATUS.second, aye: 0, nay: 0, abstain: 0 });
			}
		},

		this.approved = function() {
			// This should probably be a server-side activity.
			// Also, we only want it to happen once, hence the role check.
			// If we don't have this check, then ALL members would try to run the code and that's not good.
			if(Session.get("role") == ROLES.chairperson)
			{
				// Close the meeting
				Meetings.update({_id: this.meeting._id}, {$set: {status: MEETINGSTATUS.ended}});

				// Close any remaining orders of business
				openAgendas = Agendas.find({meetingId: this.meeting._id, status: AGENDASTATUS.active}).fetch();
				for(var x = 0; x < openAgendas.length; x++)
				{
					// We're not going to create any motions to do this, just going to close those that are open.
					// Those that are pending are left pending so it's easy to see that they were never addressed.
					Agendas.update({_id: openAgendas[x]._id}, {$set: {status: AGENDASTATUS.ended}});
				}
			}
		},

		this.validateCommand = function() {
			return true
		}
	}
}
