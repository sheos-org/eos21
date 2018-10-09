const fs = require('fs');
const check = require('../../utils/Check');

var ERC20Token = artifacts.require("./ERC20Token.sol");
var BlackHole = artifacts.require("./BlackHoleEosAccount.sol")

module.exports = function (deployer) {
  const configFile = "../config.json";
  //check(fs.existsSync(configFile), "configuration file: " + configFile);
  const config = JSON.parse(fs.readFileSync(configFile));
  //console.log(config)
  const name = "ERC20 Test";
  const symbol = config.blackhole.symbol;
  const decimals = config.blackhole.decimals;
  const tokens = config.blackhole.tokens;
  const genesisBlock = config.blackhole.critic_block;
  const minimumAmount = config.blackhole.minimum_amount;

  check(name, "ERC20 name: " + name);
  check(symbol, "ERC20 symbol: " + symbol);
  check(tokens, "ERC20 tokens: " + tokens);
  check(decimals, "ERC20 decimals: " + decimals);
  check(genesisBlock, "BlackHole critical block: " + genesisBlock);
  check(minimumAmount, "BlackHole minimum amount: " + minimumAmount);

  deployer.deploy(ERC20Token, name, symbol, tokens, decimals).then(() => {
    return deployer.deploy(BlackHole, ERC20Token.address, genesisBlock, minimumAmount);
  })
    .then(() => {
      fs.writeFileSync('../erc20_address', ERC20Token.address);
      fs.writeFileSync('../blackhole_address', BlackHole.address);
    })
};

