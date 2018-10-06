const fs = require('fs');
require('chai')
    .use(require('chai-as-promised'))
    .should();
Eos = require('eosjs');

const account = 'whitehole112';

// Default configuration
config = {
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", // 32 byte (64 char) hex string
    keyProvider: ['5KfTg5iPQ3qycY8J4eAgQfxigDPZagGG1Ns2dDbPrVE1oekfKZR'], // WIF string or array of keys..
    httpEndpoint: 'http://dev.cryptolions.io:38888',
    expireInSeconds: 60,
    broadcast: true,
    verbose: false, // API activity
    sign: true,
    authorization: account + '@active'
};

describe('Array', () => {
    const eos = Eos(config);

    it('fetch whitehole', async () => {
        const whiteHole = await eos.contract(account);
        whiteHole.should.not.equal(null);
    });

    it('issue without token contract set', async () => {
        const whiteHole = await eos.contract(account);
        await whiteHole.issue({
            id: 10,
            to: "mary",
            quantity: "10 EOS",
            memo: "non so"
        }).should.be.rejected;
    });

    it('set issuer owner account', async () => {
        const whiteHole = await eos.contract(account);
        await whiteHole.setissuer({
            tokenAccount: account
        }).should.be.rejected;
    });

    it('set issuer not owner account', async () => {
        const whiteHole = await eos.contract(account);
        await whiteHole.setissuer({
            tokenAccount: "whitehole111"
        }).should.be.fulfilled;
    });
});
