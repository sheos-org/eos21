pragma solidity ^0.4.22;

import "./EosValidator.sol";
import "./BlackHole.sol";

/** @title BlackHoleToPublicKey 
 * 
 * @dev It burns ERC20 tokens and log it with an associated EOS public key.
 */
contract BlackHoleToPublicKey is EosValidator, BlackHole{
    /** @dev Emitted when tokens are deadlocked.
     *  @param tokens Amount.
     *  @param eosPublicKey Associated EOS public key.
     */
    event TeleportToKey(uint tokens, string eosPublicKey);

    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public 
    BlackHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS public key.
     */
    function teleportToKey(string eosPublicKey) public {
        require(isValidKey(eosPublicKey), "not valid EOS public key");
        uint amount = attract();
        emit TeleportToKey(amount, eosPublicKey);
    }
}