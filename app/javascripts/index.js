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
