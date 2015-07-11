ROLES = { 
	administrator: "Administrator", 
	chairperson: "Chairperson",
	all : function() {
		return [ this.administrator, this.chairperson ];
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