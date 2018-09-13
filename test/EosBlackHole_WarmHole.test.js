const Web3 = require('web3');
const ganache = require('ganache-cli');
const EthCrypto = require('eth-crypto');
const fs = require('fs');

const identity = EthCrypto.createIdentity();
const web3 = new Web3();

// create a ganache-provider
const ganacheProvider = ganache.provider({
    // we preset the balance of our identity to 10 ether
    accounts: [{
        secretKey: identity.privateKey,
        balance: web3.utils.toWei('10', 'ether')
    }]
});

// set ganache to web3 as provider
web3.setProvider(ganacheProvider); 

const input = fs.readFileSync('./blackhole/build/contracts/EosBlackHole.json');
const contract = JSON.parse(input.toString());

const blackHole = new web3.eth.Contract(contract.abi);
blackHole.deploy({data: contract.bytecode}).estimateGas(function(err, gas){
    console.log(gas);
});

// const blackHole = BlackHole.new({from: identity.privateKey, data: contract.bytecode});
