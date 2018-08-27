pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract BlackHole {
    bool public closed = false;
    ERC20 public ERC20Contract;
    uint public criticBlock;
    uint public minimumAmount;

    constructor(address _ERC20Contract, uint _criticBlock, uint _minimumAmount) public {
        ERC20Contract = ERC20(_ERC20Contract);
        criticBlock = _criticBlock;
        minimumAmount = _minimumAmount;
    }

    function close() public {
        require(!closed, "blackHole already closed");
        require(block.number >= criticBlock, "blackHole hasn't reached the critical mass");
        closed = true;
    }

    function teleport(string EOS_public_key) public {
        // TODO add pk validation
        require(!closed, "blackHole closed");
        uint balance = ERC20Contract.balanceOf(msg.sender);
        uint allowed = ERC20Contract.allowance(msg.sender, address(this));
        require(allowed >= minimumAmount, "todo create message with minimumAmount");
        require(balance == allowed, "blackHole must attract all your tokens");
        require(ERC20Contract.transferFrom(msg.sender, address(this), balance), "blackHole can't attract your tokens");
        emit Teleport(balance, EOS_public_key);
    }

    event Teleport(
        uint _tokens,
        string _EOS_public_key
    );
}
