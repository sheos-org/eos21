const fs = require('fs');
require('chai')
    .use(require('chai-as-promised'))
    .should();
Eos = require('eosjs');

// Default configuration
config = {
    chainId: null, // 32 byte (64 char) hex string
    keyProvider: ['5KJxTJGLYyWAvNyUYNkxeeqbkEVnuAVwh78AdoqLxkzF86gVhbP'], // WIF string or array of keys..
    httpEndpoint: 'http://127.0.0.1:8888',
    expireInSeconds: 60,
    broadcast: true,
    verbose: false, // API activity
    sign: true
};

describe('Array', function() {
    let eos = Eos(config);

    let wasm = fs.readFileSync(`./build/contracts/whitehole.wasm`);
    let abi = fs.readFileSync(`./build/contracts/whitehole.abi`);

//    eos.setcode('whitehole', 0, 0, wasm).should.be.fulfilled;

    it('fetch whitehole', async () => {
        let contract = await eos.contract('whitehole');
        contract.should.not.equal(null);
    });


//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal([1,2,3].indexOf(4), -1);
//     });
//   });
});
