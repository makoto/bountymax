import {} from "../stylesheets/app.css";
import 'react-notifications/lib/notifications.css';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/app';
import connector from './connector';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import store from './store'

function setup(){
  return new Promise(function(resolve,reject){
    let provider;
    let url = "http://localhost:8545";
    // mist loading proposal https://gist.github.com/frozeman/fbc7465d0b0e6c1c4c23
    if(typeof web3 !== 'undefined'){
      provider = web3.currentProvider;
      web3 = new Web3;
      resolve({web3, provider})
    }else{
      // connect to localhost
      provider = new Web3.providers.HttpProvider(url);
      let web3 = new Web3;
      resolve({web3, provider})
    }
  });
}

window.onload = function() {
  setup().then(({provider, web3}) => {
    web3.setProvider(provider);
    Bountymax.setProvider(provider);
    let contract = Bountymax.deployed();
    connector.setup(web3, contract);
    connector.ready().then((connector) =>{
      console.log('ready to send transactions')
    })

    contract.allEvents({}, function(error, data) {
      console.log('allEvents',data.event, data.args)
      let message;
      switch (data.event) {
        case 'BountyClaimed':
          // message = `Congratulation! you won ${data.args.amount.toNumber()}`
          message = `Congratulation! you successfully exploited`;
          connector.emitter.emit('notification', {status:'success', message: message});
          break;
        case 'ExploitFailed':
          message = `Your exploitation did not work. Try again`
          connector.emitter.emit('notification', {status:'error', message: message});
          break;
        default:
          connector.emitter.emit('notification', {status:'info', message: data.event});
      }
    });

    window.connector = connector;
    injectTapEventPlugin();
    ReactDOM.render(
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path='/'>
            <IndexRoute component={App}/>
          </Route>
        </Router>
      </Provider>,
      document.getElementById('app')
    );
  })
}
