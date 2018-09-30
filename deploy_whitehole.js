const whiteHoleDeployer = require('./utils/WhiteHoleDeployer');

const argv = require('minimist')(process.argv.slice(2), {
    default: {
        httpEndpoint: 'http://dev.cryptolions.io:38888',
        wasm_file: './whitehole/build/contracts/whitehole.wasm',
        abi_file: './whitehole/build/contracts/whitehole.abi'
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

whiteHoleDeployer(argv);