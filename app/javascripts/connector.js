import EventEmitter from 'events';

const emitter = new EventEmitter();

export default class Connector{
  constructor(web3, contract) {
    this.web3 = web3
    this.contract = contract
    this.getAccount().then((account) =>{
      console.log("GOT ACCOUNT")
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

  getBounties() {

  }

  register({name, targetAddress, bountyAddress, reward}){
    console.log("REGISTERING")
    this.contract.register.sendTransaction(
      name,
      targetAddress,
      bountyAddress,
      {from:this.account, value:reward}
    )
  }

  exploit(targetAddress, bountyAddress, exploitAddress){

  }
}
