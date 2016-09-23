import store from './store'
import { setBounties } from './actions/bounties'
import { addNotification } from './actions/notification'
import { addActivity } from './actions/activities'

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
    this.setupEvent()
    this._readyResolver(this);
  }

  ready() {
    return this._readyPromise;
  }

  setupEvent() {
    let message;
    this.contract.allEvents({}, (error, data) => {
      switch (data.event) {
        case 'BountyClaimed':
          message = `Congratulation! you successfully exploited`;
          store.dispatch(addNotification({message, status: 'success'}))
          break;
        case 'ExploitFailed':
          message = `Your exploitation did not work. Try again`
          store.dispatch(addNotification({message, status: 'error'}))
          break;
        case 'BountyRegistered':
          store.dispatch(addNotification({message: data.event, status: 'info'}))
          break;
        default:
          store.dispatch(addNotification({message: data.event, status: 'info'}))
      }
    })


    this.contract.allEvents({ fromBlock: 0}, (error, data) => {
      let message;
      switch (data.event) {
        case 'BountyClaimed':
          message = `successfully claimed 1000`;
          break;
        case 'ExploitFailed':
          message = `failed to claim`
          break;
        case 'BountyRegistered':
          this.getBounties((bounties) => store.dispatch(setBounties(bounties)))
          message = `registered ${data.args.name} contract with reward of ${data.args.reward.toNumber()}`;
          break;
        default:
          message = '';
          break;
      }

      let activity = {
        event:data.event,
        blockNumber:data.blockNumber,
        address:data.address,
        message:message
      }
      store.dispatch(addActivity(activity))
    })
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
