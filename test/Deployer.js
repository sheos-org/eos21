const fs = require('fs');

exports.deployErc20Token = (web3, identity) => {
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

exports.deployBlackHole = (web3, identity, erc20ContractAddress) => {
    const input = fs.readFileSync('./blackhole/build/contracts/BlackHoleEosAccount.json');
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

