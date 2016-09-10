module.exports = {
  build: "webpack",
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
    "edgware": {
      network_id: 1,
      host: "10.3.3.21",
      port: 8545
    // gas
    // gasPrice
    // from - default address to use for any transaction Truffle makes during migrations
    }
  }
};
