require('dotenv').config();

module.exports = {
  environment: process.env.APP_ENV,
  blockchainNode: {
    production: "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
    test: "http://127.0.0.1:7545",
    development: "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY
  },
  mainAddress: {
    production: process.env.CONTRACT_MAIN_ADDRESS_PRODUCTION,
    test: process.env.CONTRACT_MAIN_ADDRESS_TEST,
    development: process.env.CONTRACT_MAIN_ADDRESS_DEVELOPMENT
  },
  httpPort: 3000,
  httpsPort: 3001
};
