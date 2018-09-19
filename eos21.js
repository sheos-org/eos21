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

const web3 = new Web3();

const argv = require('minimist')(process.argv.slice(2), {
    string: 'blackhole',
});

const blackHoleAddress = Web3.utils.toChecksumAddress(argv.blackhole);
check(blackHoleAddress, "blackhole address: " + blackHoleAddress);
const whiteHoleAddress = argv.whitehole;
check(whiteHoleAddress, "whitehole address: " + whiteHoleAddress);
const web3Provider = argv.provider;
check(web3Provider, "Ethereum provider: " + web3Provider);
const blackHoleFile = './blackhole/build/contracts/BlackHoleEosAccount.json';
check(fs.existsSync(blackHoleFile), "blackhole file: " + blackHoleFile);

const eosJs = new EosJs();

web3.setProvider(new web3.providers.HttpProvider(web3Provider)); 
const input = fs.readFileSync(blackHoleFile);
const contract = JSON.parse(input.toString());
const abi = contract.abi;

check(web3.utils.isAddress(blackHoleAddress), "validating blackhole address");
const blackHole = new web3.eth.Contract(abi, blackHoleAddress);
check(blackHole, "create instance to blackhole contract");
check(blackHole.options.address === blackHoleAddress, "instance has correct address");

const wormHole = new WormHole(blackHole);
check(wormHole, "instantiate wormhole");

wait();





