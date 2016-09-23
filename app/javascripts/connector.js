class Connector{
  constructor(web3, contract) {
    this._readyResolver = null;
    this._readyPromise = new Promise((resolve, reject) => {
      this._readyResolver = resolve;
    });
  }

  setup (web3) {
    let contract = Bountymax.deployed();
    let url = "http://localhost:8545";
    // mist loading proposal https://gist.github.com/frozeman/fbc7465d0b0e6c1c4c23
    let provider = web3 ? web3.currentProvider : new Web3.providers.HttpProvider(url);
    web3 = new Web3;
    web3.setProvider(provider);
    Bountymax.setProvider(provider);

    this.web3 = web3;
    this.contract = contract;
    this.getAccount().then((account) =>{
      this.account = account;
    })
    this._readyResolver(this);
  }

  ready() {
    return this._readyPromise;
  }

  getAccount(){
    return new Promise((resolve,reject) =>{
      this.web3.eth.getAccounts((err, accs) => {
        if (err != null) { reject("There was an error fetching your accounts.") }
        if (accs.length == 0) { reject("Couldn't get any accounts!") }
        let accounts = accs;
        let account = accounts[0];
        resolve(account)
      })
    })
  }

  getBounties(callback){
    let contract = this.contract;
    contract.numBounties.call().then(value => {
      let bountiesArray = []
      for (var i = 1; i <= value.toNumber(); i++) {
        bountiesArray.push(i);
      }
      Promise.all(bountiesArray.map(index => {
        return contract.bountiesIndex.call(index).then(address => {
          return contract.bounties.call(address);
        })
      })).then(function(bounties){
        return bounties.map(bounty => {
          console.log('getBounties')
          var object =  {
            name: bounty[0],
            target: bounty[1],
            invariant: bounty[2],
            reward: bounty[3] || 0,
          }
          return object
        })
      }).then(bounty => { if(bounty) callback(bounty); })
    })
  }

  register({name, targetAddress, bountyAddress, reward}){
    this.contract.register.sendTransaction(
      name,
      targetAddress,
      bountyAddress,
      {from:this.account, value:reward}
    )
  }

  exploit(targetAddress, exploitAddress){
    this.contract.exploit.sendTransaction(
      targetAddress, exploitAddress,{from:this.account}
    )
  }
}

const connector = new Connector();
export default connector;
