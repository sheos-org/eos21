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
const sender = '0x82cC3f53b9DD7Fc8F546DB9eBC497b8D69B1AebA';
BlackHole.deploy({
    data: contract.bytecode,
    arguments: [argv.erc20_address, argv.critic_block, argv.minimum_amount]
})
    .send({
        from: sender,
        gas: 1500000,
        gasPrice: '30000000000000'
    }, console.log)
    .on('error', error => console.log("(EE) " + error))
    .on('transactionHash', console.log)
    .on('receipt', receipt => console.log(receipt.contractAddress)) // contains the new contract address
    .on('confirmation', (confirmationNumber, receipt) => console.log(confirmationNumber, receipt))
    .then(newContractInstance => {
        console.log(newContractInstance.options.address) // instance with the new contract address

        // Transaction has entered to geth memory pool
        console.log("Your contract is being deployed in transaction at http://testnet.etherscan.io/tx/" + contract.transactionHash);

        // http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // We need to wait until any miner has included the transaction
        // in a block to get the address of the contract
        async function waitBlock() {
            while (true) {
                let receipt = web3.eth.getTransactionReceipt(blackHole.transactionHash);
                if (receipt && receipt.contractAddress) {
                    console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
                    console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
                    break;
                }
                console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
                await sleep(4000);
            }
        }

        waitBlock();
    });