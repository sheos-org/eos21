const fs = require("fs");
const whiteHoleDeployer = require('./utils/WhiteHoleDeployer');
const check = require('./utils/Check');

const getParams = () => {
    const argv = require('minimist')(process.argv.slice(2), {
        default: {
            config: 'config.json'
        }
    });

    const configFile = argv.config;
    check(fs.existsSync(configFile), "configuration file: " + configFile);
    const config = JSON.parse(fs.readFileSync(configFile));
    return config;
}

const params = getParams().whitehole;

params.wasm_file = './whitehole/build/contracts/whitehole.wasm';
params.abi_file = './whitehole/build/contracts/whitehole.abi';

whiteHoleDeployer(params);

// const argv = require('minimist')(process.argv.slice(2), {
//     default: {
//         httpEndpoint: 'http://dev.cryptolions.io:38888',
//         wasm_file: './whitehole/build/contracts/whitehole.wasm',
//         abi_file: './whitehole/build/contracts/whitehole.abi'
//     },
//     boolean: ['help']
// });

// if (argv.help){
//     console.log("Help for WhiteHole contract deployer:");
//     console.log("");
//     console.log("  --httpEndpoint     eos node endpoint");
//     console.log("  --wasm_file        whitehole wasm file");
//     console.log("  --abi_file         whitehole abi file");
//     process.exit(0);
// }
