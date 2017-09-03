module.exports = {
  servers: {
    one: {
      host: 'eliberate.publicsphereproject.org',
      username: 'ubuntu',
      pem: "c:\\eliberate\\.ssh\\moldavite.pem"
      // pem:
      // password:
      // or leave blank for authenticate from ssh-agent
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
      ROOT_URL: 'https://eliberate.publicsphereproject.org',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    ssl:
    {
      autogenerate: {
        email: 'bioborg@gmail.com',
        domains: 'eliberate.publicsphereproject.org'
      }
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
  },
};
