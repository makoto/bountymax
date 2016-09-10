//
//
//
// let address = '0xbfa2ecc441a9ea50a461f497d415a3ddfdd802e5';
// let name = (new Date()).toString();
// c.register(name, address, address)
import React from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      targetAddress: '',
      bountyAddress: '',
      reward: '0'
    };
  }

  handleRegister() {
    this.props.connector.register(this.state)
  }

  handleName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handleTargetAddress(e) {
    this.setState({
      targetAddress: e.target.value,
    });
  }

  handleBountyAddress(e) {
    this.setState({
      bountyAddress: e.target.value,
    });
  }

  handleReward(e){
    this.setState({
      reward: e.target.value,
    });
  }

  render() {
    console.log('Registry state', this.state)
    return (
      <Paper zDepth={1} style={{height:'200px', padding:'5px'}}>
        <h2>Add new Bounty</h2>
        <TextField
          hintText="Name"
          value={this.state.name}
          onChange={this.handleName.bind(this)}
        />
        <TextField
          hintText="Target contract address"
          value={this.state.targetAddress}
          onChange={this.handleTargetAddress.bind(this)}
        />

        <TextField
          hintText="Bounty contract address"
          value={this.state.bountyAddress}
          onChange={this.handleBountyAddress.bind(this)}
        />
        <TextField
          hintText="Reward in ETH"
          value={this.state.reward}
          onChange={this.handleReward.bind(this)}
        />
        <FloatingActionButton
          onClick={this.handleRegister.bind(this)}
          style={{position: 'absolute', right: '15px'}}
        >
          <ContentAdd />
        </FloatingActionButton>
      </Paper>
    )
  }
}

export default Register;
