pragma solidity ^0.4.22;

import "./ElementToken.sol";

contract ERC20Token is ElementToken {
    constructor(string _name, string _symbol, uint256 _tokens, uint8 _decimals) public
        ElementToken(_name, _symbol, _tokens, _decimals) {
    }
}