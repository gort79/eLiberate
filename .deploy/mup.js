module.exports = {
  servers: {
    one: {
      host: 'eliberate.publicsphereproject.org',
      username: 'ubuntu',
      pem: "c:\\eLiberate\\.ssh\\moldavite.pem"
    }
  },

  meteor: {
    name: 'eLiberate',
    path: 'c:\\eLiberate',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true
    },
    env: {
      ROOT_URL: 'http://eliberate.publicsphereproject.org',
      MONGO_URL: 'mongodb://eliberate.publicsphereproject.org'
    },

    //dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {}
    }
  }
};
