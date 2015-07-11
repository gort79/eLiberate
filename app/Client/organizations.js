Organizations = new Meteor.Collection("organizations");

if (Meteor.isClient) {
  
  
  
  Template.organizations.userOrganization = function () {
    if(Meteor.user != null)
    {
      Meteor.subscribe('organizations');
      return Organizations.find();
    }
  };
  
  Template.organizationControls.events({
    'click #newOrganizationSubmit': function() {
      Organizations.insert({name: $("#newOrganizationName").val(), members: [{userId: Meteor.userId(), role: ROLES.adminsitrator}]});
    }
  });
  
  Template.organizations.events({
    'click #organizationLink': function() {
      Session.set("organizationId", this._id);
      Meteor.subscribe("meetings", this._id);
    }
  });

  $(document).ready(function() {
    $("#editOrganizations").click(function() {
      if($("#editOrganizations").html() == "Edit") 
      {
        $("#editOrganizations").html("Close");
        $(".organizationsContainer").animate({ height: "90%", visibility: "visible"},
          function() { $(".organizationControls").show() });
      } 
      else 
      {
        $("#editOrganizations").html("Edit");
        $(".organizationsContainer").animate({ height: "120px"});
        $(".organizationControls").hide()
      }
    });
  });
}  