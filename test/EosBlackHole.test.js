const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const EosBlackHole = artifacts.require('EosBlackHole');
const ERC20Token = artifacts.require('ERC20Token');

contract('EosBlackHole', accounts => {
    const name = 'ERC20 test';
    const symbol = 'SNS';
    const decimals = 8;
    const tokens = 100;
    const minimumAmount = 0;

    const criticBlock = 0;
    const eosPublicKey = 'EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8';
    const eosAccount = "te.mgr5ymass";

    it ("can't teleportKey if eosBlackHole is closed", async () => {
        const eosBlackHole = await EosBlackHole.new(0x0, criticBlock, minimumAmount);
        await eosBlackHole.close();
        await eosBlackHole.teleportKey(eosPublicKey).should.be.rejected;
    });

    it("teleportKey with invalid ERC20Contract", async () => {
        const eosBlackHole = await EosBlackHole.new(0x0, criticBlock, minimumAmount);
        await eosBlackHole.teleportKey(eosPublicKey).should.be.rejected;
    });

    it('teleport key', async () => {
        const erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
        const eosBlackHole = await EosBlackHole.new(erc20Token.address, criticBlock, minimumAmount);

        let watcher = eosBlackHole.TeleportKey();

        await erc20Token.approve(eosBlackHole.address, 10000000000);
        await eosBlackHole.teleportKey(eosPublicKey);
        const eosBlackHoleBalance = await erc20Token.balanceOf(eosBlackHole.address);
        eosBlackHoleBalance.should.be.bignumber.equal(10000000000);
        const balance = await erc20Token.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal(0);

        const events = await watcher.get();
        events.length.should.be.equal(1);
        events[0].args.eosPublicKey.should.be.equal(eosPublicKey);
        events[0].args.tokens.should.be.bignumber.equal(10000000000);
    });

    it('teleport account', async () => {
        const erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
        const eosBlackHole = await EosBlackHole.new(erc20Token.address, criticBlock, minimumAmount);

        let watcher = eosBlackHole.TeleportAccount();

        await erc20Token.approve(eosBlackHole.address, 10000000000);
        await eosBlackHole.teleportAccount(eosAccount);
        const eosBlackHoleBalance = await erc20Token.balanceOf(eosBlackHole.address);
        eosBlackHoleBalance.should.be.bignumber.equal(10000000000);
        const balance = await erc20Token.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal(0);

        const events = await watcher.get();
        events.length.should.be.equal(1);
        events[0].args.eosAccount.should.be.equal(eosAccount);
        events[0].args.tokens.should.be.bignumber.equal(10000000000);
    });

    it('teleportKey with less than minimum balance', async () => {
        const erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
        const eosBlackHole = await EosBlackHole.new(erc20Token.address, criticBlock, 10000000001);

        await erc20Token.approve(eosBlackHole.address, 10000000000);
        await eosBlackHole.teleportKey(eosPublicKey).should.be.rejected;
    });
});

