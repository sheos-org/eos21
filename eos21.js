const socket = require('zmq').createSocket('rep');
const WormHole = require('./wormhole/WormHoleEosAccount.js');

const wait = () => {
    socket.on('message', function (buf) {
        // echo request back
        socket.send(buf);
    });

    process.on('SIGINT', function () {
        socket.close();
        console.log("... exiting.");
        process.exit();
    });

    console.log("(II) press ctrl+c to exit");
    socket.bindSync('tcp://*:5555');
};

console.log("ERC20 teleporting starts ...");

const argv = require('minimist')(process.argv.slice(2));

const blackHoleAddress = argv.blackhole;
const whiteHoleAddress = argv.whitehole;

console.log("(II) blackhole address is: " + blackHoleAddress);
console.log("(II) whitehole address is: " + whiteHoleAddress);

wait();





