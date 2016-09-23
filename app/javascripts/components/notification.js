import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import connector from '../connector';
import { connect } from 'react-redux'

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(props) {
    let notif = props.notifications
     NotificationManager[notif.status](notif.message);
  }

  render(){
    return (<div><NotificationContainer isActive={true}/></div>)
  }
}

const mapStateToProps = ({ notifications }) => ({
  notifications
})

export default connect(mapStateToProps)(Notification);
