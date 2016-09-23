import {} from "../stylesheets/app.css";
import 'react-notifications/lib/notifications.css';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/app';
import connector from './connector';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncParams } from 'react-router-redux-params'
import { addNotification } from './actions/notification'
import store from './store'

window.onload = function() {
  if(typeof web3 === 'undefined') {
    var web3;
  }
  connector.setup(web3);
  connector.ready().then((connector) =>{
    console.log('ready to send transactions')
    connector.contract.allEvents({}, function(error, data) {
      console.log('allEvents',data.event, data.args)
      let message;
      switch (data.event) {
        case 'BountyClaimed':
          message = `Congratulation! you successfully exploited`;
          store.dispatch(addNotification({message, status: 'success'}))
          break;
        case 'ExploitFailed':
          message = `Your exploitation did not work. Try again`
          store.dispatch(addNotification({message, status: 'error'}))
          break;
        default:
        store.dispatch(addNotification({message: data.event, status: 'info'}))
      }
    });
  })


  const routes = (
    <Route path='/'>
      <IndexRoute component={App}/>
    </Route>
  )


  syncParams(store, routes, browserHistory)

  window.connector = connector;
  injectTapEventPlugin();
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>,
    document.getElementById('app')
  );
}
