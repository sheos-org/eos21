const WormHole = require('./wormhole/WormHoleEosAccount.js');

console.log("ERC20 teleporting start ...");

const argv = require('minimist')(process.argv.slice(2));

const blackHoleAddress = argv.blackhole;
const whiteHoleAddress = argv.whitehole;

console.log("(II) blackhole address is: " + blackHoleAddress);
console.log("(II) whitehole address is: " + whiteHoleAddress);


console.log("... ERC20 teleporting end.");


