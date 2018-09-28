let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
const check = require('./wormhole/Check');

const argv = require('minimist')(process.argv.slice(2), {
    default: {
        provider: 'http://localhost:8545',
    },
    string: ['erc20_address']
});

// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
console.log("(II) provider: " + argv.provider);
let web3 = new Web3(argv.provider);

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
const contractFile = "./blackhole/build/contracts/BlackHoleEosAccount.json";
check(fs.existsSync(contractFile), "contract: " + contractFile);
const input = fs.readFileSync(contractFile);
const contract = JSON.parse(input.toString());

// Create Contract proxy class
const BlackHole = new web3.eth.Contract(contract.abi);

check(argv.erc20_address, "erc20_address: " + argv.erc20_address);
check(argv.critic_block, "critic_block: " + argv.critic_block);
check(argv.minimum_amount, "minimum_amount: " + argv.minimum_amount);
const sender = '0x259dFB6c0e57232184cAc7209Ba1032F755f925b';
BlackHole.deploy({
    data: contract.bytecode,
    arguments: [argv.erc20_address, argv.critic_block, argv.minimum_amount]
})
    .send({
        from: sender,
        gas: 3000000,
        gasPrice: '20'
    })
    .on('error', error => console.log("(EE) " + error))
    .on('transactionHash', transactionHash => console.log("(II) transactionHash: " + transactionHash))
    .on('receipt', receipt => console.log("(II) receipt: \n" , receipt)) // contains the new contract address
    .on('confirmation', (confirmationNumber, receipt) => console.log("(II) confirmation: " + confirmationNumber))
    .then(blackHole => {
        console.log("(II) done");
    });