const fs = require('fs');

var ERC20Token = artifacts.require("./ERC20Token.sol");
var BlackHole = artifacts.require("./BlackHoleEosAccount.sol")

module.exports = function (deployer) {
  const configFile = "../config.json";
  //check(fs.existsSync(configFile), "configuration file: " + configFile);
  const config = JSON.parse(fs.readFileSync(configFile));
  //console.log(config)
  const name = config.blackhole.name;
  const symbol = config.blackhole.symbol;
  const decimals = config.blackhole.decimals;
  const tokens = config.blackhole.tokens;
  const genesisBlock = 0;
  const minimumAmount = 0;

  deployer.deploy(ERC20Token, name, symbol, tokens, decimals).then(() => {
    return deployer.deploy(BlackHole, ERC20Token.address, genesisBlock, minimumAmount);
  })
    .then(() => {
      fs.writeFileSync('../erc20_address', ERC20Token.address);
      fs.writeFileSync('../blackhole_address', BlackHole.address);
    })
};

