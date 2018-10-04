let fs = require("fs");
EosJs = require('eosjs');
const check = require('./Check');

module.exports = (argv) => {
    check(argv.http_endpoint, "http_endpoint: " + argv.http_endpoint);
    let eos = EosJs(argv);

    const { wasm_file, abi_file, account } = argv;
    check(fs.existsSync(wasm_file), "wasm file: " + wasm_file);
    check(fs.existsSync(abi_file), "abi file: " + abi_file);
    check(account, "account: " + account);

    const wasm = fs.readFileSync(wasm_file);
    const abi = fs.readFileSync(abi_file);
    eos.setcode(account, 0, 0, wasm)
        .then(result => {
            console.log(result);
            return eos.setabi(account, JSON.parse(abi));
        })
        .then(console.log);
}
