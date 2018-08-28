pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract BlackHole {
    bool public closed = false;
    ERC20 public erc20Contract;
    uint public criticBlock;
    uint public minimumAmount;

    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public {
        erc20Contract = ERC20(_erc20Contract);
        criticBlock = _criticBlock;
        minimumAmount = _minimumAmount;
    }

    function close() public {
        require(!closed, "blackHole already closed");
        require(block.number >= criticBlock, "blackHole hasn't reached the critical mass");
        closed = true;
    }

    function isValidKey(string str) public pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length != 53) return false;

        // EOS
        if (bytes1(b[0]) != 0x45 || bytes1(b[1]) != 0x4F || bytes1(b[2]) != 0x53)
            return false;

        for(uint i = 3; i<b.length; i++){
            bytes1 char = b[i];

            // 0-9 && A-Z && a-z
            if(!(char >= 0x30 && char <= 0x39) &&
               !(char >= 0x41 && char <= 0x5A) &&
               !(char >= 0x61 && char <= 0x7A)) 
            return false;
        }

        return true;
    }

    function teleport(string eosPublicKey) public {
        require(isValidKey(eosPublicKey), "not valid EOS public key");
        require(!closed, "blackHole closed");
        uint balance = erc20Contract.balanceOf(msg.sender);
        uint allowed = erc20Contract.allowance(msg.sender, address(this));
        require(allowed >= minimumAmount, "todo create message with minimumAmount");
        require(balance == allowed, "blackHole must attract all your tokens");
        require(erc20Contract.transferFrom(msg.sender, address(this), balance), "blackHole can't attract your tokens");
        emit Teleport(balance, eosPublicKey);
    }

    event Teleport(
        uint _tokens,
        string _eosPublicKey
    );
}
