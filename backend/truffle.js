module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6721975
    },
    ropsten: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "3",
      gas: 4700036,
      from: "0x0099F7aa13A19AdEBa921AF4aEee7b46aaC72Dda"
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
        version: "0.4.23"
    }
  }
}
