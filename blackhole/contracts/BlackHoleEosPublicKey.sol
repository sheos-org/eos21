pragma solidity ^0.4.22;

import "./EosValidator.sol";
import "./BlackHole.sol";

/** @title BlackHoleEosPublicKey 
 * 
 * @dev It burns ERC20 tokens and log it with an associated EOS public key.
 */
contract BlackHoleEosPublicKey is EosValidator, BlackHole{
    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public 
    BlackHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS public key.
     */
    function teleport(string eosPublicKey) public {
        require(isValidKey(eosPublicKey), "not valid EOS public key");
        super.teleport(eosPublicKey);
    }
}