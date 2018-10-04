const fs = require('fs');
const Web3 = require('web3');
const EosJs = require('eosjs');
const check = require('./utils/Check');

const createWormHole = require('./wormhole/WormHoleEosAccount.js');

console.log("ERC20 teleporting starts ...");

const getParams = () => {
    const argv = require('minimist')(process.argv.slice(2), {
        default: {
            config: 'config.json'
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

check(Web3.utils.isAddress(blackHoleAddress), "blackhole address: " + blackHoleAddress);
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

const websocketProvider = new Web3.providers.WebsocketProvider(ethereumProvider);
const web3 = new Web3(websocketProvider);
const blackHole = new web3.eth.Contract(abi, blackHoleAddress);
const eos = new EosJs(eosConfig);
eos.contract(whiteHoleAddress)
    .then(whiteHole => {
        createWormHole(blackHole, whiteHole);
    })
    .catch(reason => {
        console.log(reason);
        process.exit();
    });



