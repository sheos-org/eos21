const WormHole = require('./wormhole/WormHoleEosAccount.js');

const argv = require('minimist')(process.argv.slice(2));
console.log(argv);

const blackHoleAddress = argv.blackhole;
const whiteHoleAddress = argv.whitehole;

console.log("blackhole address is: " + blackHoleAddress);
console.log("whitehole address is: " + whiteHoleAddress);


