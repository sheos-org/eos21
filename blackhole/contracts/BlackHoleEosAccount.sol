pragma solidity ^0.4.22;

import "./EosValidator.sol";
import "./BlackHole.sol";

/** @title BlackHoleEosToAccount 
 * 
 * @dev It burns ERC20 tokens and log it with an associated EOS account.
 */
contract BlackHoleEosAccount is EosValidator, BlackHole{
    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public 
    BlackHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS account.
     */
    function teleport(string eosAccount) public {
        require(isValidAccount(eosAccount), "not valid EOS account");
        super.teleport(eosAccount);
    }
}
