var ElementToken = artifacts.require("./ElementToken.sol");
var BlackHole = artifacts.require("./BlackHole.sol")

module.exports = function (deployer) {
  const name = 'Sense test';
  const symbol = 'SNS';
  const decimals = 8;
  const tokens = 100;
  const genesisBlock = 0;

  deployer.deploy(ElementToken, name, symbol, tokens, decimals).then(() => {
    return deployer.deploy(BlackHole, ElementToken.address, genesisBlock);
  })
};

