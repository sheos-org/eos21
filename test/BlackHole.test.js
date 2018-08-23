const BlackHole = artifacts.require('BlackHole');
require('chai').should();

contract('BlackHole', accounts => {
    let blackHole = null;

    beforeEach(async () => {
        blackHole = await BlackHole.new();
    });

    it('correct deployed', async () => {
        blackHole.should.not.equal(null);
    });

    it("new blackHole isn't evaporated", async () => {
        const evaporated = await blackHole.evaporated();
        evaporated.should.equal(false);
    });
});
