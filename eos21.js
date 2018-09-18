const socket = require('zmq').createSocket('rep');
const Web3 = require('web3');
const EosJs = require('eosjs');
const fs = require('fs');

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

const check = (condition, msg) => {
    if (condition)
        console.log("(II) " + msg);
    else {
        console.error("(EE) " + msg);
        process.exit();
    }
}

console.log("ERC20 teleporting starts ...");

const argv = require('minimist')(process.argv.slice(2));

const blackHoleAddress = argv.blackhole;
check(blackHoleAddress, "blackhole address: " + blackHoleAddress);
const whiteHoleAddress = argv.whitehole;
check(whiteHoleAddress, "whitehole address: " + whiteHoleAddress);
const web3Provider = argv.provider;
check(web3Provider, "Ethereum provider: " + web3Provider);

const web3 = new Web3();
const eosJs = new EosJs();

web3.setProvider(new web3.providers.HttpProvider(web3Provider)); 
const input = fs.readFileSync('./blackhole/build/contracts/ERC20Token.json');
const contract = JSON.parse(input.toString());
const abi = contract.abi;

const blackHoleContract = web3.eth.Contract(abi, blackHoleAddress);

wait();





