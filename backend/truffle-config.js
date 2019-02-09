module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "3"
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "3"
    }
  }
};
