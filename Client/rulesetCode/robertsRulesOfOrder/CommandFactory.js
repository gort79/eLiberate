if(Meteor.isClient) {
  CreateCommandInstance = function(prototype, meeting, organization, statement, userName, dateTime, message)
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
      if(message.agendaName != undefined)
      {
        command.agendaName = message.agendaName;
      }
    }

    return command;
  }
}
