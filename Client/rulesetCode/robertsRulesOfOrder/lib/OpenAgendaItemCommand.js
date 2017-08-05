if(Meteor.isClient) {
	OpenAgendaItemCommand = function() {

		this.commandName = "Open the Next Agenda Item",
		this.commandType = "OpenAgendaItem",
		this.commandDisplayName = "Opened agenda item ",
		this.canInterrupt = false,
		this.requiresSecond = false,
		this.isDebateable = false,
		this.isAmendable = false,
		this.voteType = VOTETYPES.none,
		this.isMotion = false,
		this.closesMotion = false,
		this.orderOfPresedence = 0,
		this.meetingPart = MEETINGPARTS.administrative,
		this.tooltip = 'Used to move on to the next subject in the agenda. Useable after the current agenda is resolved or put to a committee.',

		this.addCommandIfIsValid = function(commands, currentOrderOfPresedence) {
			isValid = this.validateCommand();
			commands.push({ commandName: this.commandName, isActive: isValid, meetingPart: this.meetingPart, tooltip: this.tooltip});
		},

		this.execute = function() {
			if(this.validateCommand()) {

				// Close the existing agenda item.
				var currentAgendaItem = Agendas.findOne({meetingId: this.meeting._id, status: AGENDASTATUS.active});
				if(currentAgendaItem != undefined) {
					Agendas.update({_id: currentAgendaItem._id}, {$set:{
						status: AGENDASTATUS.ended
					}});
				}

				// Open the next agenda item.
				var nextAgendaItem = Agendas.findOne({meetingId: this.meeting._id, status: AGENDASTATUS.pending}, {sort: {ordinal: 1}});
				Agendas.update({_id: nextAgendaItem._id}, {$set:{
					status: AGENDASTATUS.active
				}});

				// Clear the queue.
				var queues = Queues.find({meetingId:this.meeting._id}).fetch();
				for(var i = 0; i < queues.length; i++)
				{
					Queues.remove({_id: queues[i]._id});
				}

				// Save the command
				this.agendaName = nextAgendaItem.name;
				this._id = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, agendaName: this.agendaName, statement: this.statement });
			}
		},

		this.validateCommand = function() {
			if(this.meeting.status == MEETINGSTATUS.started
				 && Agendas.find({meetingId: this.meeting._id, status: AGENDASTATUS.pending}).count() > 0
				 && CurrentMotion() == undefined
				 && Session.get("role") == ROLES.chairperson)
				 {
					 return true;
				 }
			return false;
		}
	}
}
