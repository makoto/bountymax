# BountyMax

Smart contract securities to the max.

This project was developed as part of Thomson Reuters HackETHon held in London during the summary of 2016. It was originally hosted under https://github.com/bountymax but moved to this repo after the original repo owner decided to take it down.

The project was developed with [@awishformore](https://twitter.com/awishformore) [@andrewscj](https://twitter.com/andrewscj) [@andysigner](https://twitter.com/andysigner) [@misterigl](https://twitter.com/misterigl)

Read the articles for more detail.

- [Blockchain Based Sports Game Wins Thomson Reuters HackETHon](https://www.cryptocoinsnews.com/blockchain-based-sports-game-wins-thomson-reuters-hackethon/)
- [Insurance Giants Launch Blockchain Initiative](https://www.cryptocoinsnews.com/insurance-giants-launch-blockchain-initiative/)

## Prerequisite

- [node.js](https://nodejs.org/en) = v6.3.1
- [npm](http://npmjs.com) = v3.10.3
- [truffle](http://truffle.readthedocs.org) = v 2.0.8
- [testrpc](https://github.com/ethereumjs/testrpc) = v 2.2.4

## setup

- Clone the repo.
- Install npm dependencies

```
npm install
```
- Startup testrpc in one console

```
testrpc
```

- compile, deploy, build and serve the server in another

```
truffle compile
truffle migrate --reset
truffle server
```

- Go to http://localhost:8080/


## TODO

- Hook into exploit event
- Add validation on blank, and address type.
- Integrate Reuter's Identity
- Convert from Wai to Ether
- Clear form on submit

### Contracts security

- Do not allow empty address(it defaults to 0x0000000000000000000000000000000000000000)
- Do not allow duplicate target address (or index by invariant)
