const fs = require("fs");
const blackHoleDeployer = require('./utils/BlackHoleDeployer');
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

const params = getParams().blackhole;
params.erc20_address = fs.readFileSync('./erc20_address', 'utf-8');

params.contract_file = "./blackhole/build/contracts/BlackHoleEosAccount.json";

blackHoleDeployer(params)
.then(instance => {
    console.log("(RESULT) blackhole address: " + instance.options.address);
    fs.writeFileSync('./blackhole_address', instance.options.address);
})
.catch(console.error);
