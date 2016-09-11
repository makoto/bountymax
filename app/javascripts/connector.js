import EventEmitter from 'events';

const emitter = new EventEmitter();

export default class Connector{
  constructor(web3, contract) {
    this.web3 = web3;
    this.contract = contract;
    console.log('CONTRACT', contract)
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
    console.log('getBounties1')
    let contract = this.contract;
    console.log('getBounties2', this.contract, contract)
    contract.numBounties.call().then(value => {
      console.log('getBounties3')
      let bountiesArray = []
      for (var i = 1; i <= value.toNumber(); i++) {
        bountiesArray.push(i);
      }
      console.log('getBounties4')
      Promise.all(bountiesArray.map(index => {
        console.log('getBounties5')
        return contract.bountyIndex.call(index).then(address => {
          console.log('getBounties6')
          return contract.bounties.call(address);
        })
      })).then(function(bounties){
        console.log('getBounties7')
        return bounties.map(bounty => {
          console.log('getBounties8')
          var object =  {
            name: bounty[0],
            owner: bounty[1],
            target: bounty[2],
            invariant: bounty[3],
            deposit: bounty[4],
            hunter: bounty[5],
            exploit: bounty[6]
          }
          return object
        })
      }).then(bounty => { if(bounty) callback(bounty); })
    })
  }

  register({name, targetAddress, invariantAddress, deposit}){
    this.contract.register.sendTransaction(
      name,
      targetAddress,
      invariantAddress,
      {from:this.account, value:deposit}
    )
  }

  exploit(targetAddress, invariantAddress, exploitAddress){
    this.contract.exploit.sendTransaction(
      targetAddress, invariantAddress, exploitAddress, {from:this.account}
    )
  }
}
