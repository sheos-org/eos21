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
    }],
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
            from: identity.address,
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
            from: identity.address,
            gas: 3000000,
            gasPrice: '20'
        })
        .on('error', console.log)
//        .on('transactionHash', console.log)
//        .on('receipt', receipt => console.log(receipt.contractAddress))
};

deployErc20Token().then(instance => {
    const erc20TokenAddress = instance.options.address;
    console.log("ERC20Contract address: " + erc20TokenAddress);
    return deployBlackHole(erc20TokenAddress);
}).then(instance => {
    const blackHoleAddress = instance.options.address;
    console.log("BlackHole address: " + blackHoleAddress);
});




