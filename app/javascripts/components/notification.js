import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import connector from '../connector';

class Notification extends React.Component {
  constructor(props) {
    console.log('hello notification')
    super(props);
    this.state = {};
  }

  componentDidMount(){
    console.log('notification componentDidMount')
    connector.ready().then((c) => {
      c.emitter.on('notification', (obj) => {
        NotificationManager[obj.status](obj.message);
      })
    })
  }

  render(){
    return (<div><NotificationContainer isActive={true}/></div>)
    // return(<div>Hello</div>)
  }
}
export default Notification;
