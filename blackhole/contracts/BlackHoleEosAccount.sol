pragma solidity ^0.4.22;

import "./EosValidator.sol";
import "./BlackHole.sol";

/** @title BlackHoleEosToAccount 
 * 
 * @dev It burns ERC20 tokens and log it with an associated EOS account.
 */
contract BlackHoleEosAccount is EosValidator, BlackHole{
    /** @dev Emitted when tokens are deadlocked.
     *  @param tokens Amount.
     *  @param eosAccount Associated EOS account.
     */
    event TeleportToAccount(uint tokens, string eosAccount);

    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public 
    BlackHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS account.
     */
    function teleportToAccount(string eosAccount) public {
        require(isValidAccount(eosAccount), "not valid EOS account");
        uint amount = attract();
        emit TeleportToAccount(amount, eosAccount);
    }
}
