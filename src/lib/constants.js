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

FLOORSTATUS = {
	closed: "Closed",
	queued: "Queued",
	open: "Open",

	all: function() {
		return [ this.closed, this.queued, this.open ];
	}
}