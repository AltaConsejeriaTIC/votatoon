module.exports = {
  environment: "development",
  blockchainNode: {
    production: "http://ropsten.vivelabbogota.com:7545",
    test: "http://127.0.0.1:7545",
    development: "http://127.0.0.1:8545"
  },
  mainAddress: {
    production: "0x0099F7aa13A19AdEBa921AF4aEee7b46aaC72Dda",
    test: "0x001844F2742718E9dB34859B8007340eb2aC8880",
    development: "" // Change for first account in ganache-cli
  },
  httpPort: 3000,
  httpsPort: 3001
};
