const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHoleEosAccount = artifacts.require('BlackHoleEosAccount');
const ERC20Token = artifacts.require('ERC20Token');

contract('BlackHoleEosAccount', accounts => {
    const name = 'ERC20 test';
    const symbol = 'SNS';
    const decimals = 8;
    const tokens = 100;
    const minimumAmount = 0;

    const criticBlock = 0;
    const eosAccount = "te.mgr5ymass";

    it('teleport', async () => {
        const erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
        const blackHole = await BlackHoleEosAccount.new(erc20Token.address, criticBlock, minimumAmount);

        let watcher = blackHole.Teleport();

        await erc20Token.approve(blackHole.address, 10000000000);
        await blackHole.teleport(eosAccount);
        const blackHoleBalance = await erc20Token.balanceOf(blackHole.address);
        blackHoleBalance.should.be.bignumber.equal(10000000000);
        const balance = await erc20Token.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal(0);

        const events = await watcher.get();
        events.length.should.be.equal(1);
        events[0].args.id.should.be.bignumber.equal(0);
        events[0].args.note.should.be.equal(eosAccount);
        events[0].args.amount.should.be.bignumber.equal(10000000000);
    });
});

