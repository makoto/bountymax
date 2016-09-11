import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import Bounties from './bounties';
import Register from './register';
import Notification from './notification';
import Activity from './activity';

const App = (props) => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <div>
      <AppBar titleStyle={{textAlign:'center', fontSize:'xx-large', fontFamily:'sans-serif'}} style={{backgroundColor:"#46ae32"}}
        title={
          <span>BountyMax<span style={{fontSize:'small', fontFamily:'sans-serif'}}> - The Mad Max of Cyber Bounty  -</span></span>
        }
        iconElementLeft={<Avatar src="https://15254b2dcaab7f5478ab-24461f391e20b7336331d5789078af53.ssl.cf1.rackcdn.com/ethereum.vanillaforums.com/favicon_85d47ba50743e3c3.ico" size={50} backgroundColor="white" />}
        iconElementRight={
          <span>
            <Activity connector = {props.connector} />
          </span>
        }
      />
      <div className='container'>
        <Notification connector = {props.connector} />
        <Bounties connector = {props.connector} />
        <Register connector = {props.connector} />
      </div>
    </div>
  </MuiThemeProvider>
)
export default App;
