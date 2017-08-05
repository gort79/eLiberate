if(Meteor.isClient) {
	PostponeIndefinitelyCommand = function() {

		this.commandName = "Postpone Indefinitely",
		this.commandType = "PostponeIndefinitely",
		this.commandDisplayName = "Member moves that the motion be postponed indefinitely",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = false,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 725,
		this.meetingPart = MEETINGPARTS.subsidiary,
		this.tooltip = 'Delay what is currently being debated for a later, unknown date in a different meeting. Need 1: a 2nd 2: a majority vote. Can be debated.',

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

		this.approved = function() {
			// Have the chairperson close the motion and add a comment stating the motion has been postponed indefinitely
			if(Session.get("role") == ROLES.chairperson){
				// Close the parent motion if there is one
				var parentMotion = CurrentParentMotion();
				if(parentMotion != undefined)
				{
					Messages.update({_id: parentMotion._id}, {status: MOTIONSTATUS.postponed});
					Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: "MakeAStatement", statement: "The motion has been postponed indefinitely."})
				}
			}
		},

		this.validateCommand = function() {
			if(CurrentMotion() != undefined) {
				return true
			}
			return false;
		}
	}
}
