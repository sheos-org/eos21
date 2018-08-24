const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHole = artifacts.require('BlackHole');

contract('BlackHole', accounts => {
    const nullAddress = 0x0;
    const genesisBlock = 0;
    const note = 'no problems, just solutions';

    it('correct deployed', async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock);
        blackHole.should.not.equal(null);
    });

    it('criticBlock set correctly', async () => {
        const criticBlock = 1000;
        const blackHole = await BlackHole.new(nullAddress, criticBlock);
        const result = await blackHole.criticBlock();
        result.should.be.bignumber.equal(criticBlock);
    })

    it("new blackHole isn't evaporated", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock);
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(false);
    });

    it("blackHole can evaporate after criticBlock", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock);
        await blackHole.evaporate();
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(true);
    });

    it("blackHole can't evaporate before criticBlock", async () => {
        const criticBlock = web3.eth.blockNumber + 1000;
        const blackHole = await BlackHole.new(nullAddress, criticBlock);
        (blackHole.evaporate()).should.be.rejected;
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(false);
    });

    it ("can't teleport if blackHole is evaporated", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock);
        await blackHole.evaporate();
        (blackHole.teleport(note)).should.be.rejected;
    });

    it("teleport with invalid ECR20Cotract", async () => {
        const blackHole = await BlackHole.new(nullAddress, genesisBlock);
        (blackHole.teleport(note)).should.be.rejected;
    });
});
