contract Bountymax {
  struct Bounty {
      string name;
      address target;
      uint256 reward;
  }
  mapping (address => Bounty) public bounties;

  function register(address target, address invariant) public {
  }

  function exploit(address target, address bounty, address exploit) public {
  }


  // todo: getBounties?

  event ExploitTested (
    bytes32 exploit,
    bool success
  );

  event BountyRegistered (
    string name,
    address target,
    uint256 reward
  );
}
