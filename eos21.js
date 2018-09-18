const WormHole = require('./wormhole/WormHoleEosAccount.js');

console.log("ERC20 teleporting start ...");

const argv = require('minimist')(process.argv.slice(2));

const blackHoleAddress = argv.blackhole;
const whiteHoleAddress = argv.whitehole;

console.log("(II) blackhole address is: " + blackHoleAddress);
console.log("(II) whitehole address is: " + whiteHoleAddress);

var zmq = require('zmq')
    , socket = zmq.createSocket('rep');

socket.on('message', function (buf) {
    // echo request back
    socket.send(buf);
});

process.on('SIGINT', function () {
    socket.close();
    console.log("... ERC20 teleporting end.");
    process.exit();
});

console.log("(II) press ctrl+c to exit");
socket.bindSync('tcp://*:5555');



