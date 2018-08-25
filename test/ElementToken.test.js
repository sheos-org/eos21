const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const ElementToken = artifacts.require('ElementToken');

contract('ElementToken', accounts => {
  let elementToken = null;

  const name = 'Element test';
  const symbol = 'SNS';
  const decimals = 8;
  const tokens = 100;

  beforeEach(async function () {
    elementToken = await ElementToken.new(name, symbol, tokens, decimals);
  });

  it('initial balance', async function () {
    const amount = await elementToken.balanceOf(accounts[0]);
    amount.should.be.bignumber.equal(10000000000)
  });

  it('allowance without approve', async function() {
    const remaining = await elementToken.allowance(accounts[0], accounts[1]);
    remaining.should.be.bignumber.equal(0);
  });

  it('allowance with approve', async function() {
    await elementToken.approve(accounts[1], tokens);
    const remaining = await elementToken.allowance(accounts[0], accounts[1]);
    remaining.should.be.bignumber.equal(tokens);
  });
});