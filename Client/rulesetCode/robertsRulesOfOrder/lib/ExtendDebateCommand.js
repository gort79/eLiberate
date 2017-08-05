if(Meteor.isClient) {
	ExtendDebateCommand = function() {

		this.commandName = "Extend Debate",
		this.commandType = "ExtendDebate",
		this.commandDisplayName = "Member moves to extend debate",
		this.canInterrupt = false,
		this.requiresSecond = true,
		this.isDebateable = true,
		this.isAmendable = true,
		this.voteType = VOTETYPES.twothirdsmajority,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 700,
		this.meetingPart = MEETINGPARTS.subsidiary,
		this.tooltip = 'Lengthen the maximum amount of time for each speech Increase the number of times members can speak. Needs 1: 2/3ds vote.',

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
				 	 && currentMotion.status == MOTIONSTATUS.debate
				)
			{
				return true
			}
			else if(this.meeting.status == MEETINGSTATUS.started
						  && currentMotion == undefined
							&& this.meeting.inDebate)
			{
				return true;
			}
			return false;
		}
	}
}
