pragma solidity ^0.4.22;

contract BlackHole {
    bool public evaporated = false;
    uint public criticBlock;

    constructor(uint _criticBlock) public {
        criticBlock = _criticBlock;
    }

    function evaporate() public {
        if (block.number >= criticBlock)
            evaporated = true;
    }
}
