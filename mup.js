module.exports = {
  servers: {
    one: {
      host: 'ec2-18-220-192-114.us-east-2.compute.amazonaws.com',
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
      ROOT_URL: 'http://18.220.195.181',
      MONGO_URL: 'mongodb://localhost/meteor'
    },

/*
    ssl:
    {
      autogenerate: {
        email: 'bioborg@gmail.com',
        domains: 'eliberate.publicsphereproject.org'
      }
    },
*/

    dockerImage: 'abernix/meteord:base',
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
