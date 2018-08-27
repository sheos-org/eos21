var ERC20Token = artifacts.require("./ERC20Token.sol");
var BlackHole = artifacts.require("./BlackHole.sol")

module.exports = function (deployer) {
  const name = 'Sense test';
  const symbol = 'SNS';
  const decimals = 8;
  const tokens = 100;
  const genesisBlock = 0;
  const minimumAmount = 0;

  deployer.deploy(ERC20Token, name, symbol, tokens, decimals).then(() => {
    return deployer.deploy(BlackHole, ERC20Token.address, genesisBlock, minimumAmount);
  })
};

