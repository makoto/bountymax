// Copyright (c) 2016 Andrew Jones
//
// This file is part of BOUNTYMAX.
//
// BOUNTYMAX is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import "OraclizeI.sol";

contract Bountymax is usingOraclize {

  struct Bounty {
    string name;
    address owner;
    address target;
    address invariant;
    uint deposit;
  }

  struct Request {
    address target;
    address invariant;
    address exploit;
    address hunter;
  }

  address owner;
  uint8 feePercentage;
  uint collectedFees;
  address constant feeCollector = 0x9e3561cabf084dff31cab2fd89eafd9f359467b4; // todo: populate with collection address we have the PK for...

  string host;
  mapping (bytes32 => Bounty) public bounties;
  mapping (bytes32 => Request) public requests;

  function Bountymax() {
    owner = msg.sender;
    host = "http://sandbox.bountymax.com/";
    feePercentage = 5;
  }

  function setFeePercentage(uint8 newFee) public {
    if (msg.sender != owner) throw;
    uint oldFee = feePercentage;
    feePercentage = newFee;
    FeeChange(oldFee, newFee);
  }

  function withdrawFees() public {
    if (!owner.send(collectedFees)) throw;
    FeeWithdrawal(collectedFees);
    collectedFees = 0;
  }

  /// called by dApp owner to register a contract with a bounty for hacking
  function register(string name, address target, address invariant) public {

    // generate unique ID for target & invariant, so we can have multiple
    // bounties per target
    bytes32 bountyID = sha3(strConcat(toString(target), toString(invariant)));

    // check if a bounty with this target & invariant already exists and abort
    // if it does
    if (bounties[bountyID].target != 0x0) throw;

    // register the new bounty
    bounties[bountyID] = Bounty({name: name, owner: msg.sender, target: target, invariant: invariant, deposit: msg.value});
    BountyRegistered(name, msg.sender, target, invariant, msg.value);
  }

  // called to unregister / cancel a bounty
  function unregister(address target, address invariant) public {

    // generate unique ID for target & invariant, so we can have multiple
    // bounties per target
    bytes32 bountyID = sha3(strConcat(toString(target), toString(invariant)));

    // throw if he's not the owner
    if (bounties[bountyID].owner != msg.sender) throw;

    // cancel the bounty
    string name = bounties[bountyID].name;
    uint deposit = bounties[bountyID].deposit;
    delete bounties[bountyID];
    BountyCanceled(name, msg.sender, target, invariant, deposit);
  }

  /// called by a bounty 'hunter' with an exploit to test against the contract
  function exploit(address target, address invariant, address exploit) public {

    // generate unique ID for target & invariant to check if bounty exists
    bytes32 bountyID = sha3(strConcat(toString(target), toString(invariant)));

    // if the bounty doesn't exist, throw
    if (bounties[bountyID].owner == 0x0) throw;

    // build the oraclize URL
    string memory t = toString(target);
    string memory i = toString(invariant);
    string memory e = toString(exploit);
    string memory url = strConcat(host, "?target=", t, "&invariant=", i);
    url = strConcat(url, "&exploit=", e);

    // QUERY ORACLIZE
    bytes32 requestID = oraclize_query("URL", url);

    // so we can pay the hunter if it succeeds
    requests[requestID] = Request({exploit: exploit, invariant: invariant, target: target, hunter: msg.sender});

    // log an exploit attempt
    Bounty bounty = bounties[bountyID];
    ExploitRequested(bounty.name, bounty.owner, target, invariant, exploit, msg.sender);
  }

  /// called by oraclize with result of exploit from sandbox
  /// result should be "true" (exploit succeeded - pay reward) or "false" (exploit failed)
  function __callback(bytes32 requestID, string result) {

    // check if the callback sender is actually oraclize
    if (msg.sender != oraclize_cbAddress()) throw;

    // get the corresponding request & bounty
    Request request = requests[requestID];
    bytes32 bountyID = sha3(strConcat(toString(request.target), toString(request.invariant)));
    Bounty bounty = bounties[bountyID];

    // if the return is not true, then the exploit failed
    if (sha3(result) != sha3("true")) {
      ExploitFailed(bounty.name, bounty.owner, bounty.target, bounty.invariant, request.exploit, request.hunter);
      delete requests[requestID];
      return;
    }

    // calculate the bounty fee and reward
    uint fee = bounty.deposit / 100 * feePercentage;
    uint reward = bounty.deposit - fee;
    collectedFees += fee;

    // send the reward to the hunter
    if (!request.hunter.send(reward)) {
      throw;
    }
    ExploitSucceeded(bounty.name, bounty.owner, bounty.target, bounty.invariant, request.exploit, request.hunter, reward, fee);
    delete requests[requestID];
  }

  event BountyRegistered (
    string name,
    address owner,
    address target,
    address invariant,
    uint reward
  );

  event BountyCanceled (
    string name,
    address owner,
    address target,
    address invariant,
    uint reward
  );

  event ExploitRequested (
    string name,
    address owner,
    address target,
    address invariant,
    address exploit,
    address hunter
  );

  event ExploitFailed (
    string name,
    address owner,
    address target,
    address invariant,
    address exploit,
    address hunter
  );

  event ExploitSucceeded (
    string name,
    address owner,
    address target,
    address invariant,
    address exploit,
    address hunter,
    uint reward,
    uint fee
  );


  event FeeChange (
    uint oldFee,
    uint newFee
  );

  event FeeWithdrawal (
    uint fees
  );

  // helpers
  function toString(address x) returns (string) {
    bytes memory b = new bytes(20);
    for (uint i = 0; i < 20; i++)
        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    return string(b);
  }
}
