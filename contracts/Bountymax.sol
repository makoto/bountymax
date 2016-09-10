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
    address target;
    address invariant;
    uint reward;
  }

  struct ExploitRequest {
    address exploit;
    address target;
    address hunter;
  }

  uint8 feePercentage;
  uint fees;
  address constant feeCollector = 0x9e3561cabf084dff31cab2fd89eafd9f359467b4; // todo: populate with collection address we have the PK for...

  string host;
  mapping (address => Bounty) public bounties;
  mapping (bytes32 => ExploitRequest) public exploitRequests;

  function Bountymax() {
    host = "http://sandbox.bountymax.com/";
    feePercentage = 5;
  }

  function setFeePercentage(uint8 percentage) public {
    feePercentage = percentage;
  }

  /// called by dApp owner to register a contract with a bounty for hacking
  function register(string name, address target, address invariant) public {
    // todo: avoid overwriting existing bounty?
    bounties[target] = Bounty({name: name, target: target, invariant: invariant, reward: msg.value});
    BountyRegistered(name, target, invariant, msg.value);
  }

  /// called by a bounty 'hunter' with an exploit to test against the contract
  function exploit(address target, address exploit) public {
    // todo: check if bounty already claimed?
    address invariant = bounties[target].invariant;
    string memory t = toString(target);
    string memory b = toString(invariant);
    string memory e = toString(exploit);
    string memory url = strConcat(host, "?target=", t, "&bounty=", b);
    url = strConcat(url, "&exploit=", e);

    // QUERY ORACLIZE
    bytes32 requestId = oraclize_query("URL", url);

    // so we can pay the hunter if it succeeds
    exploitRequests[requestId] = ExploitRequest({exploit: exploit, target: target, hunter: msg.sender});
  }

  /// called by oraclize with result of exploit from sandbox
  /// result should be "true" (exploit succeeded - pay reward) or "false" (exploit failed)
  function __callback(bytes32 requestId, string result) {
    if (msg.sender != oraclize_cbAddress()) throw;

    ExploitRequest exploit = exploitRequests[requestId];
    // todo: remove exploit request?
    if (sha3(result) == sha3("true")) {
      // pay bountymax a fee
      uint fee = reward / 100 * feePercentage;
      fees += fee;

      // use withdrawal pattern to avoid reentrancy bug
      uint reward = bounties[exploit.target].reward;
      bounties[exploit.target].reward = 0;

      if (exploit.hunter.send(reward - fee)) {
        BountyClaimed({target: exploit.target, hunter: exploit.hunter, amount: reward});
      } else {
        bounties[exploit.target].reward = reward;
      }
    } else {
      ExploitFailed({exploit: exploit.exploit, target: exploit.target});
    }
  }

  function withdrawFees() public {
    if (msg.sender == feeCollector) {
      if (!feeCollector.send(fees)) throw;
      fees = 0;
    }
  }

  event BountyRegistered (
    string name,
    address target,
    address invariant,
    uint reward
  );

  event BountyClaimed (
    address target,
    address hunter,
    uint amount
  );

  event ExploitFailed (
    address exploit,
    address target
  );

  // helpers
  function toString(address x) returns (string) {
    bytes memory b = new bytes(20);
    for (uint i = 0; i < 20; i++)
        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    return string(b);
  }
}
