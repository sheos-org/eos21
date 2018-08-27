const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHole = artifacts.require('BlackHole');

contract('BlackHole', accounts => {
    const nullAddress = 0x0;
    const genesisBlock = 0;
    const minimumAmount = 0;
    const note = 'no problems, just solutions';

    it('correct deployed', async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        blackHole.should.not.equal(null);
    });

    it('criticBlock set correctly', async () => {
        const criticBlock = 1000;
        const blackHole = await BlackHole.new(nullAddress, criticBlock, minimumAmount);
        const result = await blackHole.criticBlock();
        result.should.be.bignumber.equal(criticBlock);
    })

    it("new blackHole isn't closed", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        const closed = await blackHole.closed();
        closed.should.equal(false);
    });

    it("blackHole can close after criticBlock", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        await blackHole.close();
        const closed = await blackHole.closed();
        closed.should.equal(true);
    });

    it("blackHole can't close before criticBlock", async () => {
        const criticBlock = web3.eth.blockNumber + 1000;
        const blackHole = await BlackHole.new(nullAddress, criticBlock, minimumAmount);
        (blackHole.close()).should.be.rejected;
        const closed = await blackHole.closed();
        closed.should.equal(false);
    });

    it ("can't teleport if blackHole is closed", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        await blackHole.close();
        (blackHole.teleport(note)).should.be.rejected;
    });

    it("teleport with invalid ERC20Contract", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        (blackHole.teleport(note)).should.be.rejected;
    });

    it("close when already closed throw", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        blackHole.close();
        (blackHole.close()).should.be.rejected;
    });
});
