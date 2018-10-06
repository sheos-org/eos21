const fs = require('fs');
require('chai')
    .use(require('chai-as-promised'))
    .should();
Eos = require('eosjs');

// Default configuration
config = {
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", // 32 byte (64 char) hex string
    keyProvider: ['5KfTg5iPQ3qycY8J4eAgQfxigDPZagGG1Ns2dDbPrVE1oekfKZR'], // WIF string or array of keys..
    httpEndpoint: 'http://dev.cryptolions.io:38888',
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
        let contract = await eos.contract('whitehole112');
        contract.should.not.equal(null);
    });


//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal([1,2,3].indexOf(4), -1);
//     });
//   });
});
