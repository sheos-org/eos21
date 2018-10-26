const fs = require('fs');
const Web3 = require('web3');
const EosJs = require('eosjs');
const check = require('./utils/Check');

const createWormHole = require('./oracle/TeleportOracle.js');

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

const params = getParams();

const eosioTokenKey = params.eosiotoken.private_key;
const eosProvider = params.eosiotoken.http_endpoint;
const blackHoleFile = "./blackhole/build/contracts/BlackHoleEosAccount.json";
const ethereumProvider = params.blackhole.websocket_provider;
const eosioTokenAddress = params.eosiotoken.account;
const blackHoleAddress = fs.readFileSync('./blackhole_address', 'utf-8')
const decimals = params.blackhole.decimals;
const symbol = params.blackhole.symbol;
const chainId = params.eosiotoken.chain_id;

check(Web3.utils.isAddress(blackHoleAddress), "blackhole account: " + blackHoleAddress);
check(eosioTokenAddress, "eosio.token account: " + eosioTokenAddress);
check(eosioTokenKey, 'eosio.token key: ' + eosioTokenKey);
check(ethereumProvider, "Ethereum provider: " + ethereumProvider);
//check(fs.existsSync(blackHoleFile), "blackhole file: " + blackHoleFile);
check(eosProvider, "EOS provider: " + eosProvider);
check(symbol, "ERC20 symbol: " + symbol);
check(decimals, "ERC20 decimals: " + decimals);
check(chainId, "chain_id: " + chainId);

eosConfig = {
    chainId: chainId, // 32 byte (64 char) hex string
    keyProvider: [eosioTokenKey], // WIF string or array of keys..
    httpEndpoint: eosProvider,
    expireInSeconds: 60,
    broadcast: true,
    verbose: false, // API activity
    sign: true,
    authorization: eosioTokenAddress + '@active'
};

const input = fs.readFileSync(blackHoleFile);
const contract = JSON.parse(input.toString());
const abi = contract.abi;

const websocketProvider = new Web3.providers.WebsocketProvider(ethereumProvider);
const web3 = new Web3(websocketProvider);
const blackHole = new web3.eth.Contract(abi, blackHoleAddress);
const eos = EosJs(eosConfig);
eos.getInfo({})
    .then(result => {
        return eos.contract(eosioTokenAddress)
            .then(eosioToken => {
                createWormHole({
                    blackHole,
                    onData: event => {
                        const { amount, note } = event.returnValues;
                        const amountFloat = (amount/10**decimals).toFixed(decimals);
                        const amountWithSymbol = amountFloat + " " + symbol;
                        console.log("(EVENT) amount=" + amountWithSymbol + ", to=" + note);
                        
                        eosioToken.issue(note, amountWithSymbol, "Emerged from eosioToken")
                            .catch(console.error);
                    }
                });
                console.log("(II) waiting blackhole events ...");
            })
            .catch(reason => {
                console.log("error" + reason);
                process.exit();
            });
    });

