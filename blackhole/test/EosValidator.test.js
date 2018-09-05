const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const EosValidator = artifacts.require('EosValidator');

contract('EosValidator', accounts => {
    it("valid account name", async () => {
        const eosValidator = await EosValidator.new();
        await eosValidator.isValidAccount("te.mgr5ymass").should.eventually.be.true;
        await eosValidator.isValidAccount("teamgreymas").should.eventually.be.false;
        await eosValidator.isValidAccount("teamgreymasss").should.eventually.be.false;
        await eosValidator.isValidAccount("0eamgreymass").should.eventually.be.false;
        await eosValidator.isValidAccount("teAmgreymass").should.eventually.be.false;
        await eosValidator.isValidAccount("te6mgreymass").should.eventually.be.false;
        await eosValidator.isValidAccount("teamgreyZass").should.eventually.be.false;
    });

    it("valid public key", async () => {
        const eosValidator = await EosValidator.new();
        await eosValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.true;
        await eosValidator.isValidKey("EOS77M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // size
        await eosValidator.isValidKey("EOSM38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // size
        await eosValidator.isValidKey("EOW7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // not starting EOS
        await eosValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so70Ba9hJn9uuKDN7we8").should.eventually.be.false; // 0
        await eosValidator.isValidKey("EOS7M38bvCoO7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // O
        await eosValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJnIuuKDN7we8").should.eventually.be.false; // I
        await eosValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcKl28G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // l
    });
});