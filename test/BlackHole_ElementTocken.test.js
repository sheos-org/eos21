const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHole = artifacts.require('BlackHole');
const ElementToken = artifacts.require('ElementToken');

contract('BlackHole_ElementTocken', accounts => {
    const name = 'Element test';
    const symbol = 'SNS';
    const decimals = 8;
    const tokens = 100;

    const genesisBlock = 0;
    const note = 'no problems, just solutions';

    let elementToken = null;
    let blackHole = null;
    beforeEach(async () => {
        elementToken = await ElementToken.new(name, symbol, tokens, decimals);
        blackHole = await BlackHole.new(elementToken.address, genesisBlock);
    })

    it('teleport tokens', async () => {
        let watcher = blackHole.Teleport();

        await elementToken.approve(blackHole.address, 10000000000);
        await blackHole.teleport(note)
        const blackHoleBalance = await elementToken.balanceOf(blackHole.address);
        blackHoleBalance.should.be.bignumber.equal(10000000000);
        const balance = await elementToken.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal(0);

        const events = await watcher.get();
        events.length.should.be.equal(1);
        events[0].args._note.should.be.equal(note);
        events[0].args._tokens.should.be.bignumber.equal(10000000000);
    });
});

