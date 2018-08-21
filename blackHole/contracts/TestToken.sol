pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

contract TestToken is StandardToken, DetailedERC20 {
    constructor(string _name, string _symbol, uint8 _decimals) 
        DetailedERC20(_name, _symbol, _decimals) 
        public 
    {

    }
}
