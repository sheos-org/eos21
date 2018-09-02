pragma solidity ^0.4.22;

import "./EosValidator.sol";
import "./BlackHole.sol";

/** @title BlackHole 
 * 
 * @dev Implementation of the BlackHole contract.
 * It deadlocks ERC20 tockens and emit events on burning.
 */
contract EosBlackHole is EosValidator, BlackHole{
// Construction of the ETH BlackHole contract
    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public 
    BlackHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

// Use this function to move ERC20 tokens to a newly created EOS account associated with your public key
    function teleportKey(string eosPublicKey) public {
        require(isValidKey(eosPublicKey), "not valid EOS public key");
        uint amount = attract();
        emit TeleportKey(amount, eosPublicKey);
    }

// Use this function to move if a user has an existing EOS account, tokens can be moved via this method
    function teleportAccount(string eosAccount) public {
        require(isValidAccount(eosAccount), "not valid EOS account");
        uint amount = attract();
        emit TeleportAccount(amount, eosAccount);
    }

// Activate teleportation of ERC20 Tokens to an existing EOS account via the src/wormhole.js
    event TeleportAccount(
        uint _tokens,
        string _eosAccount
    );

// Activate teleportation of ERC20 Tokens to a new EOS account that will be created by the src/wormhole.js
    event TeleportKey(
        uint _tokens,
        string _eosPublicKey
    );
}
