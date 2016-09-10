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

contract Bountymax {
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

  mapping (address => Bounty) public bounties;
  mapping (bytes32 => ExploitRequest) public exploitRequests;

  function register(string name, address target, address invariant) public {
    // todo: avoid overwriting existing bounty?
    bounties[target] = Bounty({name: name, target: target, invariant: invariant, reward: msg.value});
    BountyRegistered(name, target, invariant, msg.value);
  }

  function exploit(address target, address exploit) public {
      // todo: check if bounty already claimed?
      // for now just simulate that it succeeded
      bytes32 requestId = 0; // todo: query oraclize here

      // so we can pay the hunter if it succeeds
      exploitRequests[requestId] = ExploitRequest({exploit: exploit, target: target, hunter: msg.sender});

      // call the callback directly for now
      // todo: remove this call directly to callback with call to oraclize
      __callback(requestId, "true");
  }

  function __callback(bytes32 requestId, string result) {
    // todo: add this back once we add in oraclise API contract
    /*if (msg.sender != oraclize_cbAddress()) throw;*/
    ExploitRequest exploit = exploitRequests[requestId];
    // todo: remove exploit request?
    if (sha3(result) == sha3("true")) {

      // use withdrawal pattern to avoid reentrancy bug
      uint reward = bounties[exploit.target].reward;
      bounties[exploit.target].reward = 0;

      if (exploit.hunter.send(reward)) {
        BountyClaimed({target: exploit.target, hunter: exploit.hunter, amount: reward});
      } else {
        bounties[exploit.target].reward = reward;
      }
    } else {
      ExploitFailed({exploit: exploit.exploit, target: exploit.target});
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
}
