const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHole = artifacts.require('BlackHole');
const ERC20Token = artifacts.require('ERC20Token');

contract('BlackHole_ERC20Tocken', accounts => {
    const name = 'ERC20 test';
    const symbol = 'SNS';
    const decimals = 8;
    const tokens = 100;
    const minimumAmount = 0;

    const criticBlock = 0;
    const eosPublicKey = 'EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8';

    let erc20Token = null;
    let blackHole = null;
    beforeEach(async () => {
        erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
        blackHole = await BlackHole.new(erc20Token.address, criticBlock, minimumAmount);
    })

    it('teleport tokens', async () => {
        let watcher = blackHole.Teleport();

        await erc20Token.approve(blackHole.address, 10000000000);
        await blackHole.teleport(eosPublicKey)
        const blackHoleBalance = await erc20Token.balanceOf(blackHole.address);
        blackHoleBalance.should.be.bignumber.equal(10000000000);
        const balance = await erc20Token.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal(0);

        const events = await watcher.get();
        events.length.should.be.equal(1);
        events[0].args._EOSPublicKey.should.be.equal(eosPublicKey);
        events[0].args._tokens.should.be.bignumber.equal(10000000000);
    });
});

