pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

// Blackhole contract - can set minimumAmount and critical block for ending ETH contract active period
contract Blackhole {
    bool public closed = false;
    ERC20 public ERC20Contract;
    uint public criticBlock;
    uint public minimumAmount;

// Construction of the ETH Blackhole contract
    constructor(address _ERC20Contract, uint _criticBlock, uint _minimumAmount) public {
        ERC20Contract = ERC20(_ERC20Contract);
        criticBlock = _criticBlock;
        minimumAmount = _minimumAmount;
    }

// Check to make sure that the contract is still active if it has not reached the critical block expiration date
    function close() public {
        require(!closed, "This Blackhole contract's active period has expired.");
        require(block.number >= criticBlock, "Blackhole hasn't reached the critical mass");
        closed = true;
    }

// Users can choose from the following 2 methods whether or not they have an existing EOS account they want to use.
// In cases where an EOS public key is sent, the wormhole.js will create an EOS account for them.

// Use this function to move if a user has an existing EOS account, tokens can be moved via this method
    function teleportaccount(string EOSAccountName) public {
    // TODO add account EOSAccountName validation
        require(!closed, "Blackhole closed");
        uint balance = ERC20Contract.balanceOf(msg.sender);
        uint allowed = ERC20Contract.allowance(msg.sender, address(this));
        require(allowed >= minimumAmount, "todo create message with minimumAmount");
        require(balance == allowed, "Blackhole must attract all your tokens");
        require(ERC20Contract.transferFrom(msg.sender, address(this), balance), "This contract is not authorized.");
        emit TeleportAcct(balance, EOSAccountName);
    }

// Use this function to move ERC20 tokens to a newly created EOS account associated with your public key
    function teleportkey(string EOSPublicKey) public {
        // TODO add EOSPublicKey validation
        require(!closed, "Blackhole closed");
        uint balance = ERC20Contract.balanceOf(msg.sender);
        uint allowed = ERC20Contract.allowance(msg.sender, address(this));
        require(allowed >= minimumAmount, "todo create message with minimumAmount");
        require(balance == allowed, "Blackhole must attract all your tokens");
        require(ERC20Contract.transferFrom(msg.sender, address(this), balance), "This contract is not authorized.");
        emit Teleport(balance, EOSPublicKey);
    }

// Activate teleportation of ERC20 Tokens to an existing EOS account via the src/wormhole.js
    event TeleportAcct(
        uint _tokens,
        string _EOSAccountName
    );

// Activate teleportation of ERC20 Tokens to a new EOS account that will be created by the src/wormhole.js
    event TeleportKey(
        uint _tokens,
        string _EOSPublicKey
    );
}
