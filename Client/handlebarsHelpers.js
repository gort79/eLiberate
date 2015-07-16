/* General Utilities */
Handlebars.registerHelper("prettifyDate", function(timestamp) {
    return new Date(timestamp).toString('yyyy-MM-dd hh:mm:ss')
});


/* Partial helpers */
var currentMessageControlsView;
/* Render message controllers */
Handlebars.registerHelper("messageControls", function(ruleset) {
	Blaze.remove(Blaze.currentView);
	$('#messageControls').remove();

	if(ruleset == RULESETS.talkingStick) { 
		currentMessageControlsView = Blaze.render(Template.talkingStickControls, $('#messageControls')[0]);
	} else {
		currentMessageControlsView = Blaze.render(Template.noRulesControls, $('#messageControls')[0]);
	}
});

/* Render message templates */
Handlebars.registerHelper("messages", function(ruleset) {
	Blaze.remove(Blaze.currentView);
	$('#messages').remove();

	if(ruleset == RULESETS.talkingStick) { 
		Blaze.render(Template.talkingStickMessages, $('#messages')[0]);
	} else {
		Blaze.render(Template.noRulesMessages, $('#messages')[0]);
	}
}); 

