const fs = require('fs');
const Web3 = require('web3');
const check = require('./wormhole/Check');

const WormHole = require('./wormhole/WormHoleEosAccount.js');

console.log("ERC20 teleporting starts ...");

const getParams = () => {
    const argv = require('minimist')(process.argv.slice(2), {
        default: {
            config: 'eos21.config'
        }
    });

    const configFile = argv.config;
    check(fs.existsSync(configFile), "configuration file: " + configFile);
    const config = JSON.parse(fs.readFileSync(configFile));
    return config;
}

const {
    blackHoleAddress,
    whiteHoleAddress,
    ethereumProvider,
    whiteHoleKey,
    blackHoleFile,
    eosProvider
} = getParams();

check(blackHoleAddress, "blackhole address: " + blackHoleAddress);
check(whiteHoleAddress, "whitehole address: " + whiteHoleAddress);
check(ethereumProvider, "Ethereum provider: " + ethereumProvider);
check(whiteHoleKey, 'whitehole key: ' + whiteHoleKey);
check(fs.existsSync(blackHoleFile), "blackhole file: " + blackHoleFile);
check(eosProvider, "EOS provider: " + eosProvider);

eosConfig = {
    chainId: null, // 32 byte (64 char) hex string
    keyProvider: [whiteHoleKey], // WIF string or array of keys..
    httpEndpoint: eosProvider,
    expireInSeconds: 60,
    broadcast: true,
    verbose: false, // API activity
    sign: true
};
 
const input = fs.readFileSync(blackHoleFile);
const contract = JSON.parse(input.toString());
const abi = contract.abi;

const wormHole = new WormHole();
check(wormHole, "instantiate wormhole");

wormHole.initEthereumProvider(new Web3.providers.HttpProvider(ethereumProvider));
wormHole.initBlackHole(abi, blackHoleAddress);
// wormHole.initEos(eosConfig);
// wormHole.initWhiteHole(whiteHoleAddress);
wormHole.initEventHandler();
wormHole.teleport();
