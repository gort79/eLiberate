if(Meteor.isClient) {
	InformalConsiderationCommand = function() {

		this.commandName = "Informal Consideration",
		this.commandType = "InformalConsideration",
		this.commandDisplayName = "Member moves to open the floor for debate",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = false,
		this.isAmendable = true,
		this.voteType = VOTETYPES.simpleMajority,
		this.isMotion = false,
		this.closesMotion = true,
		this.orderOfPresedence = 750,
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
			var currentMotion = CurrentMotion();
			if(currentMotion != undefined)
			{
				Messages.update({_id: currentMotion._id}, {$set: {status: MOTIONSTATUS.debate}});
			}
			else
			{
				Meetings.update({_id: Session.get("MeetingId")}, {$set: {inDebate: true}});
			}
		},

		this.validateCommand = function() {
			var currentMotion = CurrentMotion();
			if(this.meeting.status == MEETINGSTATUS.started
				 && currentMotion != undefined
					 && currentMotion.isDebateable
				 	 && currentMotion.status != MOTIONSTATUS.debate
				)
			{
				return true
			}
			else if(this.meeting.status == MEETINGSTATUS.started
						  && currentMotion == undefined
							&& !this.meeting.inDebate)
			{
				return true;
			}
			return false;
		}
	}
}
