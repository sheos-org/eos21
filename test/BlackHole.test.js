const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHole = artifacts.require('BlackHole');

contract('BlackHole', accounts => {
    const erc20ContractAddress = 0x0;
    const criticBlock = 0;
    const minimumAmount = 0;
    const eosPublicKey = 'EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8';

    it('correct deployed', async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        blackHole.should.not.equal(null);
    });

    it('criticBlock set correctly', async () => {
        const criticBlock = 1000;
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        const result = await blackHole.criticBlock();
        result.should.be.bignumber.equal(criticBlock);
    })

    it("new blackHole isn't closed", async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        const closed = await blackHole.closed();
        closed.should.equal(false);
    });

    it("blackHole can close after criticBlock", async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        await blackHole.close();
        const closed = await blackHole.closed();
        closed.should.equal(true);
    });

    it("blackHole can't close before criticBlock", async () => {
        const criticBlock = web3.eth.blockNumber + 1000;
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        (blackHole.close()).should.be.rejected;
        const closed = await blackHole.closed();
        closed.should.equal(false);
    });

    it ("can't teleport if blackHole is closed", async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        await blackHole.close();
        (blackHole.teleport(eosPublicKey)).should.be.rejected;
    });

    it("teleport with invalid ERC20Contract", async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        (blackHole.teleport(eosPublicKey)).should.be.rejected;
    });

    it("close when already closed throw", async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        blackHole.close();
        (blackHole.close()).should.be.rejected;
    });
});
