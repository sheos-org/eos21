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

    it("new blackHole isn't evaporated", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(false);
    });

    it("blackHole can evaporate after criticBlock", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        await blackHole.evaporate();
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(true);
    });

    it("blackHole can't evaporate before criticBlock", async () => {
        const criticBlock = web3.eth.blockNumber + 1000;
        const blackHole = await BlackHole.new(nullAddress, criticBlock, minimumAmount);
        (blackHole.evaporate()).should.be.rejected;
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(false);
    });

    it ("can't teleport if blackHole is evaporated", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        await blackHole.evaporate();
        (blackHole.teleport(note)).should.be.rejected;
    });

    it("teleport with invalid ERC20Contract", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        (blackHole.teleport(note)).should.be.rejected;
    });

    it("evaporate when already evaporated throw", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock, minimumAmount);
        blackHole.evaporate();
        (blackHole.evaporate()).should.be.rejected;
    });
});
