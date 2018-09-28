let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
const check = require('./wormhole/Check');

const argv = require('minimist')(process.argv.slice(2), {
    default: {
        provider: 'http://localhost:8545',
        contract_file: './blackhole/build/contracts/BlackHoleEosAccount.json',
        gas: 3000000
    },
    boolean: ['help'],
    string: ['erc20_address', 'sender']
});

if (argv.help){
    console.log("Help for BlackHole contract deployer:");
    console.log("");
    console.log("  --sender           address of account that is installing the contract");
    console.log("  --erc20_address    address of erc20 contract blackhole will teleport from");
    console.log("  --gas              amount of gas used in the transaction");
    console.log("  --critic_block     after it anyone can close the blackhole");
    console.log("  --minimum_amount   the minimum number of teportable tokens");
    console.log("  --contract_file    compiled blackhole contract");
    process.exit();
}

console.log("(II) provider: " + argv.provider);
let web3 = new Web3(argv.provider);

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
check(fs.existsSync(argv.contract_file), "contract: " + argv.contract_file);
const input = fs.readFileSync(argv.contract_file);
const contract = JSON.parse(input.toString());

// Create Contract proxy class
const BlackHole = new web3.eth.Contract(contract.abi);

check(argv.sender, "sender: " + argv.sender);
check(argv.erc20_address, "erc20_address: " + argv.erc20_address);
check(argv.critic_block, "critic_block: " + argv.critic_block);
check(argv.minimum_amount, "minimum_amount: " + argv.minimum_amount);

console.log("(II) start deployment (gas: " + argv.gas + ") ...");
BlackHole.deploy({
    data: contract.bytecode,
    arguments: [argv.erc20_address, argv.critic_block, argv.minimum_amount]
})
    .send({
        from: argv.sender,
        gas: argv.gas,
    })
    .on('error', error => console.log("(EE) " + error))
    .on('transactionHash', transactionHash => console.log("(II) transactionHash: " + transactionHash))
    .on('receipt', receipt => console.log("(II) receipt: \n" , receipt)) // contains the new contract address
    .on('confirmation', (confirmationNumber, receipt) => console.log("(II) confirmation: " + confirmationNumber))
    .then(blackHole => {
        console.log("(II) ... done");
    });