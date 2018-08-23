const BlackHole = artifacts.require('BlackHole')

contract('BlackHole', accounts => {
    beforeEach(async function () {
        await BlackHole.new();
    });

    it('check deployment', () => BlackHole.deployed().then(
        instance => assert.notEqual(null, instance)
    ))
})
