if(Meteor.isClient) {
  CreateCommandInstance = function(prototype, meeting, organization, statement, userId, userName, dateTime, message)
  {
    var command = Object.create(prototype);

    command.meeting = meeting;
    command.statement = statement;
    command.userId = userId;
    command.userName = userName;
    command.organization = organization;
    command.dateTime = dateTime;

    if(message != undefined)
    {
      // Get them all dynamically first so we don't miss anything, then manually override from there
      var keys = Object.keys(message);
      for(var i = 0; i < keys.length; i++)
      {
        command[keys[i]] = message[keys[i]];
      }

      if(message._id != undefined)
      {
        command._id = message._id;
      }
      if(message.status != undefined)
      {
        command.status = message.status;
      }
      if(message.aye != undefined)
      {
        command.aye = message.aye;
      }
      if(message.nay != undefined)
      {
        command.nay = message.nay;
      }
      if(message.abstain != undefined)
      {
        command.abstain = message.abstain;
      }
      if(message.secondedBy != undefined)
      {
        command.secondedBy = message.secondedBy;
      }
      if(message.agendaName != undefined)
      {
        command.agendaName = message.agendaName;
      }
      if(message.motionIdPutToVote != undefined)
      {
        command.motionIdPutToVote = message.motionIdPutToVote;
        command.motionPutToVote = GetMotion(command.motionIdPutToVote);
        command.voteType = command.motionPutToVote.voteType;
      }
    }

    return command;
  }
}
