import React from 'react';
import ReactDOM from 'react-dom';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Exploit from './exploit';
import connector from '../connector';

export default class Bounties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {bounties:[]};
  }

  componentDidMount(){
    connector.ready().then((c) => {
      c.contract.allEvents({fromBlock:'latest'}, (error, data) => {
        c.getBounties((bounties) => {
          this.setState({bounties:bounties})
        })
      })
      c.getBounties((bounties) => {
        this.setState({bounties:bounties})
      })
    })
  }

  render(){
    let showBounties = this.state.bounties.map((bounty) => {
      return(
        <TableRow>
          <TableRowColumn>
            {bounty.name}
          </TableRowColumn>
          <TableRowColumn>
            {bounty.target}
          </TableRowColumn>
          <TableRowColumn>
            {bounty.invariant}
          </TableRowColumn>
          <TableRowColumn>
            {bounty.reward.toString()}
          </TableRowColumn>
          <TableRowColumn>
            <Exploit invariantAddress={bounty.invariant}/>
          </TableRowColumn>
        </TableRow>
      )
    })

    return (
      <Paper zDepth={1} style={{height:'500px'}}>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn >Name</TableHeaderColumn>
              <TableHeaderColumn >Target</TableHeaderColumn>
              <TableHeaderColumn >Invariant</TableHeaderColumn>
              <TableHeaderColumn >Reward</TableHeaderColumn>
              <TableHeaderColumn ></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {showBounties}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}
