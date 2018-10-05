const fs = require('fs');

module.exports = (web3, identity) => {
    const input = fs.readFileSync('../blackhole/build/contracts/ERC20Token.json');
    const contract = JSON.parse(input.toString());
    const abi = contract.abi;
    const bytecode = contract.bytecode;
    const erc20Token = new web3.eth.Contract(abi);
    const name = 'ERC20 test';
    const symbol = 'PARTICLE';
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