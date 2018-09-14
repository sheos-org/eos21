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

// ERC20 Contract deploy
const input = fs.readFileSync('./blackhole/build/contracts/ERC20Token.json');
const contract = JSON.parse(input.toString());

const abi = contract.abi;
const bytecode = contract.bytecode;

const erc20Token = new web3.eth.Contract(abi);

function deployErc20Token() {
    const name = 'ERC20 test';
    const symbol = 'SNS';
    const decimals = 8;
    const tokens = 100;

    try {
        erc20Token.deploy({
            data: bytecode,
            arguments: [name, symbol, decimals, tokens]
        })
            .send({
                from: identity.address,
                gas: 1500,
                gasPrice: '30'
            })
            .on('error', error => console.log)
            .on('transactionHash', transactionHash => console.log)
            .on('receipt', receipt => console.log(receipt.contractAddress))
            .then(instance => console.log(instance.options.address));
    } catch (e) {
        console.log("Error in deplyment: " + e);
    }
};

function deployBlackHole() {
    // BlackHole deplay
    const input = fs.readFileSync('./blackhole/build/contracts/EosBlackHole.json');
    const contract = JSON.parse(input.toString());

    const blackHole = new web3.eth.Contract(contract.abi);

    const erc20ContractAddress = '0x000';
    const criticBlock = 0;
    const minimumAmount = 0;

    try {
        blackHole.deploy({
            data: contract.bytecode,
            arguments: [erc20ContractAddress, criticBlock, minimumAmount]
        })
            .send({
                from: identity.address,
                gas: 1500000,
                gasPrice: '30000000000000'
            })
            .on('error', error => console.log)
            .on('transactionHash', transactionHash => console.log)
            .on('receipt', receipt => console.log(receipt.contractAddress))
            .then(instance => console.log(instance.options.address));
    } catch (e) {
        console.log(e);
    }
};


deployErc20Token();