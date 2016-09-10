import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Bounties from './bounties';

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
            <FlatButton style={{color:'white'}} label="About" />
          </span>
        }
      />
      <div className='container'>
        <Bounties connector = {props.connector} />
        <Paper zDepth={1} style={{height:'200px', padding:'5px'}}>
          <h2>Add new Bounty</h2>
          <TextField
            hintText="Target contract address"
          />
          <TextField
            hintText="Bounty contract address"
          />
          <TextField
            hintText="Reward in ETH"
          />
          <FloatingActionButton style={{position: 'absolute', right: '15px'}}>
            <ContentAdd />
          </FloatingActionButton>
        </Paper>
      </div>
    </div>
  </MuiThemeProvider>
)
export default App;
