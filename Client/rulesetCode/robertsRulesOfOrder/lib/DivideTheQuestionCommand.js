//if(Meteor.isClient) {
//	DivideTheQuestionCommand = function() {
//
//		this.commandName = "Divide the Question",
//		this.commandType = "DivideTheQuestion",
//		this.commandDisplayName = "Member moves to divide the question",
//		this.canInterrupt = false,
//		this.requiresSecond = true,
//		this.isDebateable = false,
//		this.isAmendable = true,
//		this.voteType = VOTETYPES.simpleMajority,
//		this.isMotion = false,
//		this.closesMotion = true,
//		this.orderOfPresedence = 0,
//		this.meetingPart = MEETINGPARTS.incidental,
//
//		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
//			isValid = this.validateCommand();
//			commands.push({ commandName: this.commandName, isActive: this.orderOfPresedence < currentOrderOfPresedence && isValid, meetingPart: this.meetingPart});
//		},
//
//		this.execute = function() {
//			if(this.validateCommand()) {
//				// Save the command
//				this.status = MOTIONSTATUS.second;
//				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, statement: this.statement, status: MOTIONSTATUS.second, aye: 0, nay: 0, abstain: 0 });
//			}
//		},
//
//		this.approved = function() {
//			// Close the parent motion if there is one
//			var parentMotion = CurrentParentMotion();
//			if(parentMotion != undefined)
//			{
//				Messages.update({_id: parentMotion._id}, {status: MOTIONSTATUS.killed});
//			}
//		},
//
//		this.validateCommand = function() {
//			if(this.meeting.status == MEETINGSTATUS.started
//				 && CurrentMotion() != undefined) {
//				return true
//			}
//			return true;
//		}
//	}
//}
//
