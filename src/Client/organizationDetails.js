if(Meteor.isClient) {
	Meetings = new Meteor.Collection("meetings");


	if (Meteor.isClient) {
	  Template.meetings.organizationMeetings = function() {
		return Meetings.find({organizationId: Session.get("organizationId")});
	  };
	  
	  Template.meetings.organizationId = function() {
		return Session.get("organizationId");
	  };
	  
	  Template.meetings.events({
		'click #meetingId': function() {
		  Session.set("meetingId", this._id);
		}
	  });

	  Template.meetingControls.events({
		'click #newMeetingSubmit': function() {
		  alert(Meetings.insert({name: $('#newMeetingName').val(), dateTime: new Date($('#newMeetingDate').val() + ' ' + $('#newMeetingTime').val()), organizationId: Session.get("organizationId")}));
		}
	  });
	  
	  $(document).ready(function() {
		$("#editOrganizationDetails").click(function() {
		  if($("#editOrganizationDetails").html() == "Edit") 
		  {
			$("#editOrganizationDetails").html("Close");
			$(".organizationDetailsContainer").animate({ height: "90%", visibility: "visible"},
			  function() { $(".meetingControls").show() });
			$(".meetings").animate({ bottom: "150px"});
		  } 
		  else 
		  {
			$("#editOrganizationDetails").html("Edit");
			$(".organizationDetailsContainer").animate({ height: "120px"});
			$(".meetingControls").hide();
			$(".meetings").animate({ bottom: "50px"});
		  }
		});
	  });
	}  
}