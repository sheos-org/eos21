const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const ERC20Token = artifacts.require('ERC20Token');

contract('ERC20Token', accounts => {
  let erc20Token = null;

  const name = 'ERC20 test';
  const symbol = 'SNS';
  const decimals = 8;
  const tokens = 100;

  beforeEach(async function () {
    erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
  });

  it('initial balance', async function () {
    const amount = await erc20Token.balanceOf(accounts[0]);
    amount.should.be.bignumber.equal(10000000000)
  });

  it('allowance without approve', async function() {
    const remaining = await erc20Token.allowance(accounts[0], accounts[1]);
    remaining.should.be.bignumber.equal(0);
  });

  it('allowance with approve', async function() {
    await erc20Token.approve(accounts[1], tokens);
    const remaining = await erc20Token.allowance(accounts[0], accounts[1]);
    remaining.should.be.bignumber.equal(tokens);
  });
});