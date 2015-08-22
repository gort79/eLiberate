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
		return [ this.noRules, this.talkingStick, this.robertsRules ];
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
	superMajority: "Super Majority",

	all: function() {
		return [ this.none, this.simpleMajority, this.twoThirdsMajority, this.superMajority ];
	}
}
