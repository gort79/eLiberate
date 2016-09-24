ROLES = {
	administrator: "Administrator",
	chairperson: "Chairperson",
	member: "Member",
	guest: "Guest",

	all : function() {
		return [ this.chairperson, this.administrator, this.member, this.guest ];
	}
};

RULESETS = {
	noRules: "No Rules",
	talkingStick: "Talking Stick",
	robertsRules: "Roberts Rules of Order",

	all : function() {
		return [ this.robertsRules, this.talkingStick, this.noRules ];
	}
};

MEETINGSTATUS = {
	pending: "Not Started",
	started: "In Progress",
	ended: "Ajourned",

	all: function() {
		return [ this.pending, this.started, this.ended ];
	}
}

AGENDASTATUS = {
	pending: "Not Started",
	active: "In Progress",
	ended: "Closed",

	all: function() {
		return [ this.pending, this.active, this.ended ];
	}
}

FLOORSTATUS = {
	closed: "Closed",
	queued: "Queued",
	open: "Open",

	all: function() {
		return [ this.closed, this.queued, this.open ];
	}
}

VOTETYPES = {
	none: "Non-Votable",
	simpleMajority: "Simple Majority",
	twoThirdsMajority: "Two-Thirds Majority",

	all: function() {
		return [ this.none, this.simpleMajority, this.twoThirdsMajority ];
	}
}

VOTEOPTIONS = {
	aye: "Aye",
	nay: "Nay",
	abstain: "Abstain",

	all: function() {
		return [ this.aye, this.nay, this.abstain ];
	}
}

MEETINGPARTS = {
	privileged: "Privileged",
	administrative: "Administrative",
	subsidiary: "Subsidiary",
	main: "Main",
	incidental: "Incidental",
	revisit: "Revisit",

	all: function() {
		return [ this.administrative, this.subsidiary, this.main, this.incidental, this.revisit ];
	}
}

MOTIONSTATUS = {
	second: "Needs Second",
	notSeconded: "Not Seconded",
	seconded: "Seconded",
	debate: "In Debate",
	toVote: "To Vote",
	approved: "Approved",
	denied: "Denied",
	killed: "Killed",
	postponed: "Postponed",
	none: "None",

	all: function() {
		return [ this.second, this.notSeconded, this.seconded, this.debate, this.toVote, this.approved, this.denied, this.killed, this.postponed, this.none ];
	}
}
