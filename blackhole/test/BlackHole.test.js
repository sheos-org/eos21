const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHole = artifacts.require('BlackHole');
const ERC20Token = artifacts.require('ERC20Token');

contract('BlackHole', accounts => {
    const erc20ContractAddress = 0x0;
    const criticBlock = 0;
    const minimumAmount = 0;

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

    it ("can't teleport if blackHole is closed", async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        await blackHole.close();
        await blackHole.teleport("Give me a pizza").should.be.rejected;
    });

    it("teleport with invalid ERC20Contract", async () => {
        const blackHole = await BlackHole.new(0x0, criticBlock, minimumAmount);
        await blackHole.teleport("Give me another pizza").should.be.rejected;
    });

    it("blackHole can't close before criticBlock", async () => {
        const criticBlock = web3.eth.blockNumber + 1000;
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        await blackHole.close().should.be.rejected;
        const closed = await blackHole.closed();
        closed.should.equal(false);
    });

    it("close when already closed throw", async () => {
        const blackHole = await BlackHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        blackHole.close();
        await blackHole.close().should.be.rejected;
    });

    it('teleport with less than minimum balance', async () => {
        const name = 'ERC20 test';
        const symbol = 'SNS';
        const decimals = 8;
        const tokens = 100;

        const erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
        const blackHole = await BlackHole.new(erc20Token.address, criticBlock, 10000000001);

        await erc20Token.approve(blackHole.address, 10000000000);
        await blackHole.teleport("Now a caffe").should.be.rejected;
    });
});
