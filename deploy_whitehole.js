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

whiteHoleDeployer(params)
.then(instance => {
    console.log(instance.address);
});
