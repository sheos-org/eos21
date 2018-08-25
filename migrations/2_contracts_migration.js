var ElementToken = artifacts.require("./ElementToken.sol");
var BlackHole = artifacts.require("./BlackHole.sol")

module.exports = async function (deployer) {
  const name = 'Sense test';
  const symbol = 'SNS';
  const decimals = 8;
  const tokens = 100;
  const genesisBlock = 0;

  await deployer.deploy(ElementToken, name, symbol, tokens, decimals);
  await deployer.deploy(BlackHole, ElementToken.address, genesisBlock);
};

