const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config();

module.exports = {
  networks: {
    develop: {
        accounts: 5,
        defaultEtherBalance: 500,
        blockTime: 3,
        provider: function() {
            return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:9545");
        },
        network_id: "*", // Match any network id
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6721975
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 3,
      gas: 3000000,
      gasPrice: 10000000000
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "3",
      gas: 4700036,
      from: "0x001844F2742718E9dB34859B8007340eb2aC8880"
    }
  },
  compilers: {
    solc: {
        version: "0.4.17"
    }
  }
}
