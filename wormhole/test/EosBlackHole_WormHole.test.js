const Web3 = require('web3');
const ganache = require('ganache-cli');
const EthCrypto = require('eth-crypto');
const fs = require('fs');
require('chai').use(require('chai-as-promised')).should();

const WormHole = require('../WormHoleEosAccount.js');
const erc20Deployer = require('./ERC20Deployer');
const blackHoleDeployer = require('./BlackHoleDeployer.js');

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

describe('teleport ERC20 tokens', () => {
    let erc20Contract;
    let blackHoleContract;

    beforeEach(async () => {
        // deploy ERC20 contract
        erc20Contract = await erc20Deployer(web3, identities[0]);
        erc20Contract.should.not.equal(null);

        // deploy BlackHole contract
        blackHoleContract = await blackHoleDeployer(web3, identities[0], erc20Contract.options.address);
        blackHoleContract.should.not.equal(null);

        // transfer ERC20 tokens to accounts
        const amount = 10;
        for (let i = 0; i < identitiesCount; i++) {
            await erc20Contract.methods.transfer(identities[i].address, amount).send({ from: identities[0].address });
        }
    });

    it('BlackHole is opened', async () => {
        // Check BlackHole is not closed
        blackHoleContract.methods.closed().call({ from: identities[0].address }).should.eventually.be.false;
    });

    it('teloportToAccount', async () => {
        // create WormHole
        const wormHole = new WormHole();
        wormHole.initEthereumProvider(ganacheProvider);
        wormHole.initBlackHole(blackHoleContract._jsonInterface, blackHoleContract.options.address);
        wormHole.initEventHandler();

        for (let i = 0; i < identitiesCount; i++) {
            let amount = await erc20Contract.methods.balanceOf(identities[i].address).call({ from: identities[i].address });
            result = await erc20Contract.methods.approve(blackHoleContract.options.address, amount).send({ from: identities[i].address });
            result.status.should.be.true;
            await blackHoleContract.methods.teleportToAccount("te.mgr5ymass").send({ from: identities[i].address });
            result = await erc20Contract.methods.balanceOf(identities[i].address).call({ from: identities[i].address });
            result.should.be.equal('0');
        }
    });

    it('teloportToAccount_using_address', async () => {
        const blackHoleAddress = blackHoleContract.options.address;
        console.log("blackHoleAddress: " + blackHoleAddress);

        const input = fs.readFileSync('../blackhole/build/contracts/BlackHoleEosAccount.json');
        const contract = JSON.parse(input.toString());
        const abi = contract.abi;
        let count = 0;

        const wormHole = new WormHole();
        wormHole.initEthereumProvider(ganacheProvider);
        wormHole.initBlackHole(abi, blackHoleAddress);
        wormHole.initEventHandler((account, amount) => count++);

        for (let i = 0; i < identitiesCount; i++) {
            let amount = await erc20Contract.methods.balanceOf(identities[i].address).call({ from: identities[i].address });
            result = await erc20Contract.methods.approve(blackHoleContract.options.address, amount).send({ from: identities[i].address });
            result.status.should.be.true;
            await blackHoleContract.methods.teleportToAccount("te.mgr5ymass").send({ from: identities[i].address });
            result = await erc20Contract.methods.balanceOf(identities[i].address).call({ from: identities[i].address });
            result.should.be.equal('0');
        }

        count.should.be.equal(identitiesCount);
    });
});

