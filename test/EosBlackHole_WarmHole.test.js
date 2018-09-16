const Web3 = require('web3');
const ganache = require('ganache-cli');
const EthCrypto = require('eth-crypto');
const fs = require('fs');
const WarmHole = require('../warmhole/WarmHole.js');
require('chai').use(require('chai-as-promised')).should();

const web3 = new Web3();

var identities = []
const identitiesCount = 10;
for (let i = 0; i < identitiesCount; i++) {
    identities.push(EthCrypto.createIdentity());
}

console.log(identities.map(identity => ({secretKey: identity.privateKey, balance: web3.utils.toWei('10', 'ether') })))
// create a ganache-provider
const ganacheProvider = ganache.provider({
    // we preset the balance of our identities to 10 ether
    accounts: identities.map(identity => ({secretKey: identity.privateKey, balance: web3.utils.toWei('10', 'ether') })),
});

// set ganache to web3 as provider
web3.setProvider(ganacheProvider);

const deployErc20Token = () => {
    const input = fs.readFileSync('./blackhole/build/contracts/ERC20Token.json');
    const contract = JSON.parse(input.toString());
    const abi = contract.abi;
    const bytecode = contract.bytecode;
    const erc20Token = new web3.eth.Contract(abi);
    const name = 'ERC20 test';
    const symbol = 'SNS';
    const decimals = 8;
    const tokens = 100;

    return erc20Token.deploy({
        data: bytecode,
        arguments: [name, symbol, decimals, tokens]
    })
        .send({
            from: identities[0].address,
            gas: 3000000,
            gasPrice: '20'
        })
        .on('error', error => console.log("Error: " + error))
    //    .on('transactionHash', hash => console.log("Transaction: " + hash))
    //    .on('receipt', receipt => console.log("Receipt :" + receipt))
    //    .on('confirmation', (confirmationNumber, receipt) => console.log(confirmationNumber, receipt))

};

const deployBlackHole = (erc20ContractAddress) => {
    const input = fs.readFileSync('./blackhole/build/contracts/EosBlackHole.json');
    const contract = JSON.parse(input.toString());

    const blackHole = new web3.eth.Contract(contract.abi);

    const criticBlock = 0;
    const minimumAmount = 0;

    return blackHole.deploy({
        data: contract.bytecode,
        arguments: [erc20ContractAddress, criticBlock, minimumAmount]
    })
        .send({
            from: identities[0].address,
            gas: 3000000,
            gasPrice: '20'
        })
        .on('error', console.log)
    //        .on('transactionHash', console.log)
    //        .on('receipt', receipt => console.log(receipt.contractAddress))
};

describe('prova', async () => {
    // deploy the ERC20 contract
    const erc20Contract = await deployErc20Token();
    erc20Contract.should.not.equal(null);

    // get the amount of erc20 tokens
    let amount = await erc20Contract.methods.balanceOf(identities[0].address).call({from: identities[0].address});
    //const partAmount = amount / identitiesCount;

    for (let i=0 ; i < identitiesCount ; i++){
        await erc20Contract.methods.transfer(identities[i].address, 10).send({from: identities[0].address});
    }



    // deploy BlackHole contract
    const blackHoleContract = await deployBlackHole(erc20Contract.options.address);
    blackHoleContract.should.not.equal(null);

    // create WarmHole
    const warmHole = new WarmHole(blackHoleContract);
    warmHole.should.not.equal(null);

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
    // console.log(result);
});

