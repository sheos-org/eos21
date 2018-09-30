const whiteHoleDeployer = require('./utils/WhiteHoleDeployer');

const argv = require('minimist')(process.argv.slice(2), {
    default: {
        httpEndpoint: 'http://dev.cryptolions.io:38888',
        wasm_file: './whitehole/build/contracts/whitehole.wasm',
        abi_file: './whitehole/build/contracts/whitehole.abi'
    },
    boolean: ['help']
});

if (argv.help){
    console.log("Help for WhiteHole contract deployer:");
    console.log("");
    console.log("  --httpEndpoint     eos node endpoint");
    console.log("  --wasm_file        whitehole wasm file");
    console.log("  --abi_file         whitehole abi file");
    process.exit(0);
}

whiteHoleDeployer(argv);