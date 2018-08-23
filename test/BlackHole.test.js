const BlackHole = artifacts.require('BlackHole');

contract('BlackHole', accounts => {
    let blackHole = null;

    beforeEach(async () => {
        blackHole = await BlackHole.new();
    });

    it('correct deployed', async () => {
        assert.notEqual(blackHole, null)
    });

    it("new blackHole isn't evaporated", async () => {
        const evaporated = await blackHole.evaporated();
        assert.equal(evaporated, false);
    });
});
