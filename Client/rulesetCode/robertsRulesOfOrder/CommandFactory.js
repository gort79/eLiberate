if(Meteor.isClient) {
  CreateCommandInstance = function(prototype, meeting, organization, statement, userName, dateTime)
  {
    return Object.create(prototype, {
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
  }
}
