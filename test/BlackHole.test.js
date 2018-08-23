const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

const BlackHole = artifacts.require('BlackHole');

contract('BlackHole', accounts => {
    it('correct deployed', async () => {
        const criticBlock = 0;
        const blackHole = await BlackHole.new(criticBlock);
        blackHole.should.not.equal(null);
    });

    it('criticBlock set correctly', async () => {
        const criticBlock = 1000;
        const blackHole = await BlackHole.new(criticBlock);
        const result = await blackHole.criticBlock();
        result.should.be.bignumber.equal(criticBlock);
    })

    it("new blackHole isn't evaporated", async () => {
        const criticBlock = 0;
        const blackHole = await BlackHole.new(criticBlock);
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(false);
    });

    it("blackHole can evaporate after criticBlock", async () => {
        const currentBlock = web3.eth.blockNumber;
        const criticBlock = currentBlock;
        const blackHole = await BlackHole.new(criticBlock);
        await blackHole.evaporate();
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(true);
    });

    it("blackHole can't evaporate before criticBlock", async () => {
        const currentBlock = web3.eth.blockNumber;
        const criticBlock = currentBlock + 1000;
        const blackHole = await BlackHole.new(criticBlock);
        await blackHole.evaporate();
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(false);
    });
});
