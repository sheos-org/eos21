pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract EosValidator {
    function isValidKey(string str) public pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length != 53) return false;

        // EOS
        if (bytes1(b[0]) != 0x45 || bytes1(b[1]) != 0x4F || bytes1(b[2]) != 0x53)
            return false;

        for(uint i = 3; i<b.length; i++){
            bytes1 char = b[i];

            // base58
            if(!(char >= 0x31 && char <= 0x39) &&
               !(char >= 0x41 && char <= 0x48) &&
               !(char >= 0x4A && char <= 0x4E) &&
               !(char >= 0x50 && char <= 0x5A) &&
               !(char >= 0x61 && char <= 0x6B) &&
               !(char >= 0x6D && char <= 0x7A)) 
            return false;
        }

        return true;
    }

    function isValidAccount(string account) public pure returns (bool){
        bytes memory b = bytes(account);
        if (b.length != 12) return false;

        for(uint i = 0; i<b.length; i++){
            bytes1 char = b[i];

            // a-z && 1-5 && .
            if(!(char >= 0x61 && char <= 0x7A) && 
               !(char >= 0x31 && char <= 0x35) && 
               !(char == 0x2E)) 
            return  false;
        }
        
        return true;
    }
}

// BlackHole contract - can set minimumAmount and critical block for ending ETH contract active period
contract BlackHole {
    EosValidator private eosValidator;
    bool public closed = false;
    ERC20 public erc20Contract;
    uint public criticBlock;
    uint public minimumAmount;

// Construction of the ETH BlackHole contract
    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public {
        erc20Contract = ERC20(_erc20Contract);
        criticBlock = _criticBlock;
        minimumAmount = _minimumAmount;
    }

// Check to make sure that the contract is still active if it has not reached the critical block expiration date
    function close() public {
        require(!closed, "This BlackHole contract's active period has expired.");
        require(block.number >= criticBlock, "BlackHole hasn't reached the critical mass");
        closed = true;
    }

// Use this function to move ERC20 tokens to a newly created EOS account associated with your public key
    function teleportKey(string eosPublicKey) public {
        require(eosValidator.isValidKey(eosPublicKey), "not valid EOS public key");
        uint amount = withdraw();
        emit TeleportKey(amount, eosPublicKey);
    }

// Use this function to move if a user has an existing EOS account, tokens can be moved via this method
    function teleportAccount(string eosAccount) public {
        require(eosValidator.isValidAccount(eosAccount), "not valid EOS account");
        uint amount = withdraw();
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

    function withdraw() private returns (uint amount){
        require(!closed, "blackHole closed");
        uint balance = erc20Contract.balanceOf(msg.sender);
        uint allowed = erc20Contract.allowance(msg.sender, address(this));
        require(allowed >= minimumAmount, "less than minimum amount");
        require(balance == allowed, "blackHole must attract all your tokens");
        require(erc20Contract.transferFrom(msg.sender, address(this), balance), "blackHole can't attract your tokens");
        return balance;
    }
}
