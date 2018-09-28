let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
const check = require('../wormhole/Check');

module.exports = (argv) => {
    console.log("(II) provider: " + argv.provider);
    let web3 = new Web3(argv.provider);

    // Read the compiled contract code
    // Compile with
    // solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
    check(fs.existsSync(argv.contract_file), "contract_file: " + argv.contract_file);
    const input = fs.readFileSync(argv.contract_file);
    const contract = JSON.parse(input.toString());

    // Create Contract proxy class
    const BlackHole = new web3.eth.Contract(contract.abi);

    check(argv.sender, "sender: " + argv.sender);
    check(argv.erc20_address, "erc20_address: " + argv.erc20_address);
    check(argv.critic_block | argv.critic_block === 0, "critic_block: " + argv.critic_block);
    check(argv.minimum_amount | argv.minimum_amount === 0, "minimum_amount: " + argv.minimum_amount);

    console.log("(II) start deployment (gas: " + argv.gas + ") ...");
    return BlackHole.deploy({
        data: contract.bytecode,
        arguments: [argv.erc20_address, argv.critic_block, argv.minimum_amount]
    })
        .send({
            from: argv.sender,
            gas: argv.gas,
        })
        .on('error', error => console.log("(EE) " + error))
        .on('transactionHash', transactionHash => console.log("(II) transactionHash: " + transactionHash))
        .on('receipt', receipt => console.log("(II) receipt: \n", receipt)) // contains the new contract address
        .on('confirmation', (confirmationNumber, receipt) => console.log("(II) confirmation: " + confirmationNumber))
        .then(blackHole => {
            console.log("(II) ... done");
            return blackHole;
        });
}
