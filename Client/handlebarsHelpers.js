/* General Utilities */
Handlebars.registerHelper("prettifyDate", function(timestamp) {
	var dateOptions = {
		year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
	};
    return new Date(timestamp).toLocaleDateString("en-US", dateOptions);
});

/* Partial helpers */
var currentMessageControlsView;
/* Render message controllers */
Handlebars.registerHelper("messageControls", function(ruleset) {
	UI.remove(UI.currentView);

	if(ruleset == RULESETS.talkingStick) {
		UI.render(Template.talkingStickControls, $('#messageControls')[0]);
	} else {
		UI.render(Template.noRulesControls, $('#messageControls')[0]);
	}
});

/* Render message templates */
Handlebars.registerHelper("messages", function(ruleset) {
	UI.remove(UI.currentView);

	if(ruleset == RULESETS.talkingStick) {
		UI.render(Template.talkingStickMessages, messages(), $('#messages')[0]);
	} else {
		UI.render(Template.noRulesMessages, messages(), $('#messages')[0]);
	}
});

Handlebars.registerHelper("Preview", function () {
    return Session.get("preview");
});

Handlebars.registerHelper("configureMenu", function() {
	if(Meteor.user() != null) {
		$(".show-modal").show();
	}
	else
	{
		$(".nav-profile").hide();
		$(".nav-organizations").hide();
		$(".nav-about").hide();
	}
});
