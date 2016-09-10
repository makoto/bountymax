import {} from "../stylesheets/app.css";
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/app';

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
    let contract = Bountymax.deployed();
    injectTapEventPlugin();
    ReactDOM.render(
      <App contract={contract}/>,
      document.getElementById('app')
    );
  })
}
