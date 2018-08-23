pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract BlackHole {
    bool public evaporated = false;
    ERC20 public ECR20Contract;
    uint public criticBlock;

    constructor(address _ERC20Contract, uint _criticBlock) public {
        ECR20Contract = ERC20(_ERC20Contract);
        criticBlock = _criticBlock;
    }

    function evaporate() public {
        if (block.number < criticBlock)
            return;

        evaporated = true;
    }

    function teleport(string note) public {
        require(ECR20Contract.transferFrom(msg.sender, address(this), 1));
        //info[msg.sender] = payload;
    }
}
