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

		this.addCommandIfIsValid = function(commands) {
			if(this.meeting.status == MEETINGSTATUS.started
				 && Agendas.find({meetingId: this.meeting._id, status: AGENDASTATUS.pending}).count() > 0
				 && Session.get("role") == ROLES.chairperson) {
				commands.push(this.commandName);
			}
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
				var nextAgendaItem = Agendas.findOne({meetingId: this.meeting._id, status: AGENDASTATUS.pending}, {$sort: {ordinal: 1}});
				Agendas.update({_id: nextAgendaItem._id}, {$set:{
					status: AGENDASTATUS.active
				}});

				// Save the command
				this.agendaName = nextAgendaItem.name;
				messageId = Messages.insert({ meetingId: this.meeting._id, dateTime: new Date(), userId: Meteor.userId(), userName: Meteor.user().username, commandType: this.commandType, agendaName: this.agendaName, statement: this.statement });
				return messageId;
			}
		},

		this.validateCommand = function() {
			// We have quorum and only a chairperson can call the meeting to order
			return true;//Attendees.find({meetingId: this.meeting._id}).count() >= organization.quorum
				   //&& Permissions.find({ organizationId: this.organization._id, userId: Meteor.userId(), role: ROLES.chairperson }).count() > 0;
		}
	}
}
