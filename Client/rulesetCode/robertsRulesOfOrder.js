if(Meteor.isClient) {
	SubmittedCommands = [];

	// Subsequent motions rely on the qualities of the last motion.
	GetLastCommand = function() {
		return SubmittedCommands[SubmittedCommands.length - 1];
	}

	// Checks to see if the meeting is currently in a motion.
	// Certain commands can only be used if we are dealing with an open motion.
	IsInMotion = function() {
		var isInMotion = false;

		for(var index = 0; index < SubmittedCommands.length; index++)
		{
			if(!isInMotion && SubmittedCommands[index].isMotion) {
				isInMotion = true;
			}
			else if (isInMotion && SubmittedCommands[index].closesMotion) {
				isInMotion = false;
			}
		}

		return isInMotion
	}

	CurrentOrderOfPresedence = function() {
		var currentMotion = CurrentMotion();

		if(currentMotion == undefined)
		{
			return Number.MAX_VALUE;
		}

		return currentMotion.orderOfPresedence;
	}

	// Gets the current motion if you need it
	CurrentMotion = function() {
		var currentMotion;
		for(var index = 0; index < SubmittedCommands.length; index++)
		{
			if(SubmittedCommands[index].isMotion) {
				currentMotion = SubmittedCommands[index];
			}
			else if (SubmittedCommands[index].closesMotion) {
				currentMotion = undefined;
			}
		}

		return currentMotion;
	}

	// Gets a motion
	GetMotion = function(motionId) {
		for(var index = 0; index < SubmittedCommands.length; index++)
		{
			if(SubmittedCommands[index]._id == motionId) {
				return SubmittedCommands[index];
			}
		}
	}

	HasTheFloor = function() {
		var queue = Queues.find({}).fetch();

		if(queue.length > 0) {
			if(queue[0].userId == Meteor.userId())
			{
				return true;
			}
		}

		return false;
	}

	// Loads up the SubmittedCommands array when you join a meeting
	$(document).on("joinedMeeting", function() {
		SubmittedCommands = [];
	});

	Template.robertsRulesOfOrderMessages.onCreated(function () {
		this.subscribe("messages", Session.get("meetingId"));
		this.subscribe("queues", Session.get("meetingId"));
		this.subscribe("agendas", Session.get("meetingId"));
		this.subscribe("votes", Session.get("meetingId"));
	});

	/* eLiberate Constants */
	Template.robertsRulesOfOrderMessages.helpers({
		meetingId: function() {
			return Session.get("meetingId") || 0;
		},

		meetingMessages: function() {
			SubmittedCommands = [];
			meeting = Meetings.findOne({_id: Session.get("meetingId")});
			organization = Organizations.findOne({_id: meeting.organizationId});
			messagesSubmitted = Messages.find({meetingId: Session.get("meetingId")}).fetch();

			for(var index = 0; index < messagesSubmitted.length; index++)
			{
				var commandPrototype = GetCommandPrototype(messagesSubmitted[index].commandType);
				var command = CreateCommandInstance(commandPrototype, meeting, organization, messagesSubmitted[index].statement, messagesSubmitted[index].userId, messagesSubmitted[index].userName, messagesSubmitted[index].dateTime, messagesSubmitted[index]);
				SubmittedCommands.push(command);
			}

			return SubmittedCommands;
		},

		queue: function() {
			return Queues.find({meetingId: Session.get("meetingId")});
		},

		agenda: function() {
			return Agendas.find({meetingId: Session.get("meetingId")});
		},

		statusIcon: function() {
			switch(this.status) {
				case AGENDASTATUS.pending:
					return "fa-square-o";
				case AGENDASTATUS.active:
					return "fa-star";
				case AGENDASTATUS.ended:
					return "fa-check-square-o";
			}
		},

		commandTemplate: function() {
			return this.commandType + "Command";
		},

		agendaOccurred: function() {
			if(this.status == AGENDASTATUS.ended
				 || this.status == AGENDASTATUS.active)
				 {
					 return true;
				 }
			return false;
		}
	});

	Template.robertsRulesOfOrderVotableCommand.helpers({
		needsSecond: function() {
			if(this.status == MOTIONSTATUS.second)
			{
				return true;
			}

			return false;
		},

		canKillMotion: function() {
			if(Session.get("role") == ROLES.chairperson
				 && this.status == MOTIONSTATUS.requiresSecond)
			{
				return true;
			}

			return false;
		},

		motionNotSeconded: function() {
			if(this.status == MOTIONSTATUS.notSeconded)
			{
				return true;

			}

			return false;
		},

		canSecond: function() {
			if(this.userId === Meteor.userId())
			{
				return false;
			}

			return true;
		},

		seconded: function() {
			if(this.secondedBy != undefined)
			{
				return true;
			}

			return false;
		}
	});

	Template.robertsRulesOfOrderVotableCommand.events({
		'click #second': function() {
			var status = "";
			if(this.isDebateable)
			{
				status = MOTIONSTATUS.debate;
			}
			else
			{
				status = MOTIONSTATUS.toVote;
			}

			this.status = status;
			Messages.update({_id: this._id}, {$set: {status: status, secondedBy: Meteor.user().username, secondedById: Meteor.userId()}});
		}
	});

	Template.PutToVoteCommand.helpers({

		requiresVote: function() {
			if(this.status == MOTIONSTATUS.toVote
			   && Votes.find({motionId: this._id, userId: Meteor.userId()}).count() == 0)
			{
				return true;
			}

			return false;
		},

		canVote: function() {
			if(Votes.find({motion: this._id, userId: Meteor.userId()}).count() > 0)
			{
				return true;
			}

			return false;
		},

		yourVote: function() {
			var vote = Votes.findOne({motionId: this._id, userId: Meteor.userId()});
			if(vote != undefined)
			{
				return vote.voteOption;
			}
			return ''
		},

		inVote: function() {
			if(this.status == MOTIONSTATUS.toVote)
			{
				return true;
			}

			return false;
		},

		approved: function() {
			if(this.status == MOTIONSTATUS.approved)
			{
				return true;
			}

			return false;
		},

		denied: function() {
			if(this.status == MOTIONSTATUS.denied)
			{
				return true;
			}

			return false;
		},

		motionPutToVote: function() {
			return this.motionPutToVote;
		}
	});

	Template.PutToVoteCommand.events({
		'click #aye': function() {
			if(Votes.find({motionId: this._id, userId: Meteor.userId()}).count() == 0)
			{
				Votes.insert({motionId: this._id, userId: Meteor.userId(), userName: Meteor.user().username, meetingId: this.meeting._id, voteOption: VOTEOPTIONS.aye});
				Messages.update({_id: this._id}, {$inc: {aye: 1}});
				TallyVote(this);
			}
		},

		'click #nay': function() {
			if(Votes.find({motionId: this._id, userId: Meteor.userId()}).count() == 0)
			{
				Votes.insert({motionId: this._id, userId: Meteor.userId(), userName: Meteor.user().username, meetingId: this.meeting._id, voteOption: VOTEOPTIONS.nay});
				Messages.update({_id: this._id}, {$inc: {nay: 1}});
				TallyVote(this);
			}
		},

		'click #abstain': function() {
			if(Votes.find({motionId: this._id, userId: Meteor.userId()}).count() == 0)
			{
				Votes.insert({motionId: this._id, userId: Meteor.userId(), userName: Meteor.user().username, meetingId: this.meeting._id, voteOption: VOTEOPTIONS.abstain});
				Messages.update({_id: this._id}, {$inc: {abstain: 1}});
				TallyVote(this);
			}
		},

		'click #killMotion': function() {
			Messages.update({_id: this._id}, {status: MOTIONSTATUS.notSeconded});
		}
	});

	TallyVote = function(motion) {
		var meeting = Meetings.findOne({_id: Session.get("meetingId")});
		var attendanceCount = Attendees.find({meetingId: meeting._id}).count();
		var voteCount = Votes.find({motionId: motion._id}).count();
		var ayeCount = Votes.find({motionId: motion._id, voteOption: VOTEOPTIONS.aye}).count();
		switch(motion.voteType)
		{
			case VOTETYPES.simpleMajority:
				if(voteCount == attendanceCount)
				{
					if(ayeCount / attendanceCount > .5)
					{
						Messages.update({_id: motion._id}, {$set: {status: MOTIONSTATUS.approved}});
						motion.status = MOTIONSTATUS.approved;
						if(motion.motionPutToVote.approved != undefined)
						{
							motion.motionPutToVote.approved()
						}
						return true;
					}
					else
					{
						motion.status = MOTIONSTATUS.denied;
						Messages.update({_id: motion._id}, {$set: {status: MOTIONSTATUS.denied}});
					}
				}
				break;
			case VOTETYPES.twoThirdsMajority:
				if(voteCount == attendanceCount)
				{
					if(ayeCount / attendanceCount > .66)
					{
	 					Messages.update({_id: motion._id}, {$set: {status: MOTIONSTATUS.approved}});
						motion.status = MOTIONSTATUS.approved;
						if(motion.motionPutToVote.approved != undefined)
						{
							motion.motionPutToVote.approved()
						}
						return true;
	 				}
	 				else
	 				{
						motion.status = MOTIONSTATUS.denied;
	 					Messages.update({_id: motion._id}, {$set: {status: MOTIONSTATUS.denied}});
	 				}
				}
				break;
		}

		return false;
	}

	Template.robertsRulesOfOrderControls.helpers({
		isChairperson: function() {
			return Session.get("role") == ROLES.chairperson;
		},

		pending: function() {
			return Meetings.findOne({_id: Session.get("meetingId")}).status == MEETINGSTATUS.pending;
		},

		calledToOrder: function() {
			return Meetings.findOne({_id: Session.get("meetingId")}).status == MEETINGSTATUS.started
						|| Session.get("role") == ROLES.chairperson;
		},

		adjourned: function() {
			return Meetings.findOne({_id: Session.get("meetingId")}).status == MEETINGSTATUS.ended;
		},

		startDateTime: function() {
			return Meetings.findOne({_id: Session.get("meetingId")}).startDateTime;
		},

		endDateTime: function() {
			return Meetings.findOne({_id: Session.get("meetingId")}).endDateTime;
		},

		queue: function() {
			return Queues.find({});
		},

		hasTheFloor: function() {
			return HasTheFloor();
		},

		allowToSubmit: function() {
			if(HasTheFloor()
				 || Session.get("role") == ROLES.chairperson)
			 {
				 	return "";
			 }

			 return "disabled";
		},

		attendingCount: function() {
			return Meetings.findOne({_id: Session.get("meetingId")}).attendance;
		},

		commands: function() {

			return CommandResolver.visitValidCommands(Messages.find({meetingId: Session.get("meetingId")}).fetch());
		}
	});


	Template.robertsRulesOfOrderControls.events({
		'click #removeFromQueue': function() {
 			Queues.remove({_id: this._id});
		},

		'click #newMessageSubmit': function() {
			CommandResolver.submitCommand();

			// Clear out the command controls
			$("#newMessage").val('');
			$("#commandSelected").val('Things you can do');
			var queue = Queues.findOne({meetingId: Session.get("meetingId"), userId: Meteor.userId()});

			if(queue != undefined)
			{
				Queues.remove({_id: queue._id});
			}
		},

		'click #commandDropdown ul li a': function() {
			$('#command').val(this);
			$('#commandSelected').html(this);
		},

		'click #messagePreviewButton': function() {
			Session.set("preview", $('#newMessage').val());
			showModal($("#messagePreviewButton"));
		},

		'click #enterQueue': function() {
			Queues.insert({meetingId: Session.get("meetingId"), userId: Meteor.userId(), userName: Meteor.user().username});
		}
	});

	$(window).on("hashchange", function () {
  	window.scrollTo(window.scrollX, window.scrollY - 84);
	});
}
