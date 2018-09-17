const Web3 = require('web3');
const ganache = require('ganache-cli');
const EthCrypto = require('eth-crypto');
const WormHole = require('../wormhole/WormHole.js');
require('chai').use(require('chai-as-promised')).should();
const deployer = require('./Deployer.js');

const web3 = new Web3();

var identities = []
const identitiesCount = 10;
for (let i = 0; i < identitiesCount; i++) {
    identities.push(EthCrypto.createIdentity());
}

// create a ganache-provider
const ganacheProvider = ganache.provider({
    // we preset the balance of our identities to 10 ether
    accounts: identities.map(identity => ({secretKey: identity.privateKey, balance: web3.utils.toWei('10', 'ether') })),
});

// set ganache to web3 as provider
web3.setProvider(ganacheProvider);

describe('prova', async () => {
    // deploy the ERC20 contract
    const erc20Contract = await deployer.deployErc20Token(web3, identities[0]);
    erc20Contract.should.not.equal(null);

    for (let i=0 ; i < identitiesCount ; i++){
        await erc20Contract.methods.transfer(identities[i].address, 10).send({from: identities[0].address});
    }

    // deploy BlackHole contract
    const blackHoleContract = await deployer.deployBlackHole(web3, identities[0], erc20Contract.options.address);
    blackHoleContract.should.not.equal(null);

    // create WormHole
    const wormHole = new WormHole(blackHoleContract);
    wormHole.should.not.equal(null);

    // Check BlackHole is not closed
    blackHoleContract.methods.closed().call({ from: identities[0].address }).should.eventually.be.false;

    for (let i = 0; i < identitiesCount; i++) {
        let amount = await erc20Contract.methods.balanceOf(identities[i].address).call({from: identities[i].address});
        result = await erc20Contract.methods.approve(blackHoleContract.options.address, amount).send({ from: identities[i].address });
        result.status.should.be.true;
        await blackHoleContract.methods.teleportToAccount("te.mgr5ymass").send({ from: identities[i].address });
        result = await erc20Contract.methods.balanceOf(identities[i].address).call({ from: identities[i].address });
        result.should.be.equal('0');
    }
});

