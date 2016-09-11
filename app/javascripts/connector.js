import EventEmitter from 'events';

const emitter = new EventEmitter();

export default class Connector{
  constructor(web3, contract) {
    this.web3 = web3;
    this.contract = contract;
    this.emitter = emitter;
    this.getAccount().then((account) =>{
      this.account = account;
      emitter.emit('ready', this)
    })
  }

  on(listeners) {
    for (let eventName in listeners){
      console.log("eventName", eventName)
      emitter.on(eventName, listeners[eventName]);
    }
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
