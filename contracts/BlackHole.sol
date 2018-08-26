pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract BlackHole {
    bool public evaporated = false;
    ERC20 public ERC20Contract;
    uint public criticBlock;

    constructor(address _ERC20Contract, uint _criticBlock) public {
        ERC20Contract = ERC20(_ERC20Contract);
        criticBlock = _criticBlock;
    }

    function evaporate() public {
        require(!evaporated, "blackHole already evaporated");
        require(block.number >= criticBlock, "blackHole hasn't reached the critical mass");
        evaporated = true;
    }

    function teleport(string note) public {
        require(!evaporated, "blackHole evaporated");
        uint balance = ERC20Contract.balanceOf(msg.sender);
        uint allowed = ERC20Contract.allowance(msg.sender, address(this));
        require(balance == allowed, "blackHole must attract all your tokens");
        require(ERC20Contract.transferFrom(msg.sender, address(this), balance), "blackHole can't attract your tokens");
        emit Teleport(balance, note);
    }

    event Teleport(
        uint _tokens,
        string _note
    );
}
