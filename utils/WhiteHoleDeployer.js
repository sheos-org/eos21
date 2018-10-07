let fs = require("fs");
EosJs = require('eosjs');
const check = require('./Check');

module.exports = (argv) => {
    check(argv.http_endpoint, "http_endpoint: " + argv.http_endpoint);
    check(argv.private_key, "private_key: " + argv.private_key);
    const eos = EosJs({
        chainId: argv.chain_id, // 32 byte (64 char) hex string
        keyProvider: [argv.private_key],
        httpEndpoint: argv.http_endpoint,
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        sign: true
    });

    const { wasm_file, abi_file, account } = argv;
    check(fs.existsSync(wasm_file), "wasm file: " + wasm_file);
    check(fs.existsSync(abi_file), "abi file: " + abi_file);
    check(account, "account: " + account);

    const wasm = fs.readFileSync(wasm_file);
    const abi = fs.readFileSync(abi_file);
    return eos.setcode(account, 0, 0, wasm)
        .then(result => {
            console.log(result);
            return eos.setabi(account, JSON.parse(abi));
        })
        .catch(console.log)
        .then(console.log)
        .catch(console.log);
}
