const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config();

module.exports = {
  networks: {
    truffle_develop: {
        accounts: 5,
        defaultEtherBalance: 500,
        blockTime: 3,
        provider: function() {
            return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:9545");
        },
        network_id: "*", // Match any network id
    },
    local_develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6721975
    },
    infura_mainnet: {
          provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
          network_id: 3,
          gas: 3000000,
          gasPrice: 10000000000
    },
    infura_ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: "*",
      gas: 3000000,
      gasPrice: 10000000000
    },
    infura_rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: "*",
    },
    ganache_test: {
        provider: () => new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545"),
      network_id: "*",
      gas: 4700036,
    }
  },
  compilers: {
    solc: {
        version: "0.4.17"
    }
  }
}
