if(Meteor.isClient) {
  CreateCommandInstance = function(prototype, meeting, organization, statement, userId, userName, dateTime, message)
  {
    var command = Object.create(prototype, {
      'meeting' : {
        value : meeting,
        enumerable : false
      },
      'organization' :{
        value : organization,
        enumerable : false
      },
      'statement' : {
        value : statement,
        enumerable : false
      },
      'userId' : {
        value : userId,
        enumerable : false
      },
      'userName' : {
        value : userName,
        enumerable : false
      },
      'dateTime' : {
        value : dateTime,
        enumerable : false
      }
    });

    if(message != undefined)
    {
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
      }
    }

    return command;
  }
}
