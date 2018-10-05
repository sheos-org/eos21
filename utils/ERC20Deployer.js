const fs = require('fs');
let Web3 = require('web3');
const check = require('./Check');

module.exports = (argv) => {
    const name = 'ERC20 test';
    const symbol = 'PARTICLE';
    const decimals = 8;
    const tokens = 100;

    check(argv.http_provider, "http_provider: " + argv.http_provider);
    let web3 = new Web3(argv.http_provider);

    //check(fs.existsSync(argv.contract_file), "contract_file: " + argv.contract_file);
    const input = fs.readFileSync(argv.contract_file);
    const contract = JSON.parse(input.toString());

    const ERC20Token = new web3.eth.Contract(contract.abi);

    console.log("(II) start deployment ...");
    return ERC20Token.deploy({
        data: contract.bytecode,
        arguments: [name, symbol, decimals, tokens]
    })
        .send({
            from: argv.sender,
            gas: argv.gas
        })
        .on('error', error => console.log("Error: " + error))
        .on('transactionHash', transactionHash => console.log("(II) transactionHash: " + transactionHash))
        .on('receipt', receipt => console.log("(RESULT): erc20token address: ", receipt.contractAddress)) // contains the new contract address
        .on('confirmation', (confirmationNumber, receipt) => console.log("(II) confirmation: " + confirmationNumber))
        .then(erc20Contract => {
            console.log("(II) ... done");
            return erc20Contract;
        })
        .catch(reason => {
            console.error(reason);
            process.exit(1);
        });
};