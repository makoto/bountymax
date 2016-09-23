import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import connector from '../connector';
import { connect } from 'react-redux'

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleOpen(){
    this.setState({open: true});
  };

  handleClose(a,b){
    this.setState({open: false});
  };

  render(){
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />
    ];

    return (
      <span>
        <FlatButton style={{color:'white'}} label="Activity" onClick={this.handleOpen.bind(this)} />
        <Dialog
          title="Activities"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
          autoScrollBodyContent={true}
          contentStyle={{width:'90%', maxWidth:'none'}}
        >
          <div>
            <List>
              {
                this.props.activities.sort((a, b) => { return b.blockNumber - a.blockNumber }).map((a, i) => {
                  return (
                    <ListItem insetChildren={true} disabled={true} key={i}
                      primaryText={
                        <p>At block {a.blockNumber}, {a.address} {a.message}</p>
                      }
                    />
                  )
                })
              }
            </List>
          </div>
        </Dialog>
      </span>
    );
  }
}

export default connect(({ activities }) => ({ activities }))(Activity)
