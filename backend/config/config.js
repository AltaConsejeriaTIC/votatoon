require('dotenv').config();

module.exports = {
  environment: process.env.APP_ENV,
  blockchainNode: {
    production: process.env.BLOCKCHAIN_NODE_PRODUCTION,
    test: process.env.BLOCKCHAIN_NODE_TEST,
    development: process.env.BLOCKCHAIN_NODE_DEVELOPMENT
  },
  mainAddress: {
    production: process.env.CONTRACT_MAIN_ADDRESS_PRODUCTION,
    test: process.env.CONTRACT_MAIN_ADDRESS_TEST,
    development: process.env.CONTRACT_MAIN_ADDRESS_DEVELOPMENT
  },
  httpPort: 3000,
  httpsPort: 3001
};
