const Web3 = require('web3');
const ganache = require('ganache-cli');
const EthCrypto = require('eth-crypto');

const identity = EthCrypto.createIdentity();
console.log(identity);

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
