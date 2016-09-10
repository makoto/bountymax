import {} from "../stylesheets/app.css";
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/app';
import Connector from './connector';

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

    let connector = new Connector(web3, contract);
    connector.on({
      'ready': (c) => {
        let address = '0xbfa2ecc441a9ea50a461f497d415a3ddfdd802e5';
        let name = (new Date()).toString();
        console.log('ready to send transactions')
      }
    })

    injectTapEventPlugin();
    ReactDOM.render(
      <App connector={connector}/>,
      document.getElementById('app')
    );
  })
}
