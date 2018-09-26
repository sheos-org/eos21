const ganache = require('ganache-cli');
const EthCrypto = require('eth-crypto');
const Web3 = require('web3');

let identities = []
const identitiesCount = 10;
for (let i = 0; i < identitiesCount; i++) {
    identities.push(EthCrypto.createIdentity());
}

// create a ganache-provider
const ganacheProvider = ganache.provider({
    // we preset the balance of our identities to 10 ether
    accounts: identities.map(identity => ({secretKey: identity.privateKey, balance: Web3.utils.toWei('10', 'ether') })),
});

// set ganache to web3 as provider
const web3 = new Web3();
web3.setProvider(ganacheProvider);

describe('ERC20Deployer', () => {
    it('deploy', () => {

    });
});