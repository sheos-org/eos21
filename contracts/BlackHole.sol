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
        if (block.number < criticBlock)
            return;

        evaporated = true;
    }

    function teleport(string note) public {
        uint balance = ERC20Contract.balanceOf(msg.sender);
        uint amount = ERC20Contract.allowance(msg.sender, address(this));
        require(balance == amount);
        require(ERC20Contract.transferFrom(msg.sender, address(this), amount));
        emit Teleport(amount, note);
    }

    event Teleport(
        uint _value,
        string _note
    );
}
