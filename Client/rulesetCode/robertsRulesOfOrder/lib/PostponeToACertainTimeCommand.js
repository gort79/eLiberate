if(Meteor.isClient) {
	PostponeToACertainTimeCommand = function() {

		this.commandName = "Postpone to a Certain Time",
		this.commandType = "PostponeToACertainTime",
		this.commandDisplayName = "Member moves to postpone the motion",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = true,
		this.closesMotion = true,
		this.orderOfPresedence = 800,
		this.meetingPart = MEETINGPARTS.subsidiary,

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
			if(Session.get("role") == ROLES.Chairperson){
				// Close the parent motion if there is one
				var parentMotion = CurrentParentMotion();
				if(parentMotion != undefined)
				{
					Messages.update({_id: parentMotion._id}, {status: MOTIONSTATUS.postponed, postponeUntil: this.postponeUntil});
					Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: "MakeAStatement", statement: "The motion has been postponed until" + this.postponeUntil + "."})
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
