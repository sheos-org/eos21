const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const TestToken = artifacts.require('TestToken');

contract('TestToken', accounts => {
  let testToken = null;

  const _name = 'My Detailed ERC20';
  const _symbol = 'MDT';
  const _decimals = 18;

  beforeEach(async function () {
    testToken = await TestToken.new(_name, _symbol, _decimals);
  });

  it('has a name', async function () {
    const name = await testToken.name();
    name.should.be.equal(_name);
  });

  it('has a symbol', async function () {
    const symbol = await testToken.symbol();
    symbol.should.be.equal(_symbol);
  });

  it('has an amount of decimals', async function () {
    const decimals = await testToken.decimals();
    decimals.should.be.bignumber.equal(_decimals);
  });
});