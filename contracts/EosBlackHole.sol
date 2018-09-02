pragma solidity ^0.4.22;

import "./EosValidator.sol";
import "./BlackHole.sol";

/** @title EosBlackHole 
 * 
 * @dev It can teleport tockens to EOS Public Key or EOS account.
 */
contract EosBlackHole is EosValidator, BlackHole{
    /** @dev Emitted when tokens are deadlocked.
     *  @param tokens Amount.
     *  @param eosAccount Associated EOS account.
     */
    event TeleportAccount(uint tokens, string eosAccount);

    /** @dev Emitted when tokens are deadlocked.
     *  @param tokens Amount.
     *  @param eosPublicKey Associated EOS public key.
     */
    event TeleportKey(uint tokens, string eosPublicKey);

    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public 
    BlackHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS public key.
     */
    function teleportKey(string eosPublicKey) public {
        require(isValidKey(eosPublicKey), "not valid EOS public key");
        uint amount = attract();
        emit TeleportKey(amount, eosPublicKey);
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS account.
     */
    function teleportAccount(string eosAccount) public {
        require(isValidAccount(eosAccount), "not valid EOS account");
        uint amount = attract();
        emit TeleportAccount(amount, eosAccount);
    }
}
