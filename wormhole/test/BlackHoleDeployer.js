const fs = require('fs');

module.exports = (web3, identity, erc20ContractAddress) => {
    const input = fs.readFileSync('../blackhole/build/contracts/BlackHoleEosAccount.json');
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

